// Returns the linear scale in meters of the units of this projection
export const getScale = (image) => image.select(0).projection().nominalScale();

// Makes evaluate a promise
export const getInfo = (instance) =>
  new Promise((resolve, reject) =>
    instance.evaluate((data, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  );

// Reduce a feature collection to array of objects with id and properties
export const getFeatureCollectionPropertiesArray = (data) =>
  data.features.map((f) => ({
    id: f.id,
    ...f.properties,
  }));

export const cleanData = (data) =>
  data.features.map((f) => ({
    id: f.id.substring(9),
    date: f.id.slice(0, 8),
    value: f.properties.value,
  }));

export const getEarthEngineData = (ee, datasetParams, features) => {
  const {
    datasetId,
    band,
    reducer = "mean",
    startDate,
    endDate,
    valueParser,
  } = datasetParams;

  const dataParser = valueParser
    ? (data) => data.map((d) => ({ ...d, value: valueParser(d.value) }))
    : (data) => data;

  const collection = ee
    .ImageCollection(datasetId)
    .select(band)
    .filter(ee.Filter.date(startDate, endDate));

  const eeScale = getScale(collection.first());

  const featureCollection = ee.FeatureCollection(features);

  const eeReducer = ee.Reducer[reducer]();

  const reduced = collection
    .map((image) =>
      image.reduceRegions({
        collection: featureCollection,
        reducer: eeReducer,
        scale: eeScale,
      })
    )
    .flatten();

  return getInfo(
    ee.FeatureCollection(
      reduced.map((feature) =>
        ee.Feature(null, {
          value: feature.get(reducer),
        })
      )
    )
  )
    .then(cleanData)
    .then(dataParser);
};
