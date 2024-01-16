const SIZE_LIMIT = 5000;

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
  data.map((f) => ({
    id: f.id.substring(9),
    date: f.id.slice(0, 8),
    value: f.properties.value,
  }));

export const getEarthEngineData = (ee, datasetParams, period, features) => {
  const { datasetId, band, reducer = "mean", valueParser } = datasetParams;
  const { startDate, endDate } = period;
  const endDatePlusOne = ee.Date(endDate).advance(1, "day");

  const dataParser = valueParser
    ? (data) =>
        data.map((d) => ({
          ou: d.id,
          period: d.date,
          value: valueParser(d.value),
        }))
    : (data) => data;

  const collection = ee
    .ImageCollection(datasetId)
    .select(band)
    .filter(ee.Filter.date(startDate, endDatePlusOne));

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

  const valueCollection = ee.FeatureCollection(
    reduced.map((feature) =>
      ee.Feature(null, {
        value: feature.get(reducer),
      })
    )
  );

  return getInfo(valueCollection.size()).then((size) => {
    if (size <= SIZE_LIMIT) {
      return getInfo(valueCollection.toList(SIZE_LIMIT))
        .then(cleanData)
        .then(dataParser);
    } else {
      const chunks = Math.ceil(size / SIZE_LIMIT);

      // console.log("Too many features, splitting into chunks", size, chunks);

      return Promise.all(
        Array.from({ length: chunks }, (_, chunk) =>
          getInfo(valueCollection.toList(SIZE_LIMIT, chunk * SIZE_LIMIT))
        )
      )
        .then((data) => [].concat(...data))
        .then(cleanData)
        .then(dataParser);
    }
  });
};
