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
  const {
    datasetId,
    band,
    reducer = "mean",
    periodType,
    periodReducer = reducer,
    valueParser,
  } = datasetParams;
  const { startDate, endDate, timeZone = "UTC" } = period;
  const endDatePlusOne = ee.Date(endDate).advance(1, "day");
  const timeZoneStart = ee.Date(startDate).format(null, timeZone);
  const timeZoneEnd = endDatePlusOne.format(null, timeZone);

  const dataParser = valueParser
    ? (data) =>
        data.map((f) => ({
          ...f.properties,
          value: valueParser(f.properties.value),
        }))
    : (data) => data.map((f) => f.properties);

  const collection = ee
    .ImageCollection(datasetId)
    .select(band)
    .filter(ee.Filter.date(timeZoneStart, timeZoneEnd));

  const eeScale = getScale(collection.first());

  const featureCollection = ee.FeatureCollection(features);

  const eeReducer = ee.Reducer[reducer]();

  let dailyCollection;

  if (periodType === "hourly") {
    const days = ee
      .Date(timeZoneEnd)
      .difference(ee.Date(timeZoneStart), "days");

    const daysList = ee.List.sequence(0, days.subtract(1));

    dailyCollection = ee.ImageCollection.fromImages(
      daysList.map((day) => {
        const startUTC = ee.Date(startDate).advance(day, "days");
        const start = ee.Date(startUTC.format(null, timeZone));
        const end = start.advance(1, "days");
        const filtered = collection.filter(ee.Filter.date(start, end));

        return filtered[periodReducer]()
          .set("system:index", startUTC.format("YYYYMMdd"))
          .set("system:time_start", start.millis())
          .set("system:time_end", end.millis());
      })
    );
  }

  const reduced = (dailyCollection || collection)
    .map((image) =>
      image
        .reduceRegions({
          collection: featureCollection,
          reducer: eeReducer,
          scale: eeScale,
        })
        .map((feature) =>
          ee.Feature(null, {
            ou: feature.get("id"),
            period: image.date().format("YYYYMMdd"),
            value: feature.get(reducer),
          })
        )
    )
    .flatten();

  const valueCollection = ee.FeatureCollection(reduced);

  return getInfo(valueCollection.size()).then((size) => {
    if (size <= SIZE_LIMIT) {
      return getInfo(valueCollection.toList(SIZE_LIMIT)).then(dataParser);
    } else {
      const chunks = Math.ceil(size / SIZE_LIMIT);

      return Promise.all(
        Array.from({ length: chunks }, (_, chunk) =>
          getInfo(valueCollection.toList(SIZE_LIMIT, chunk * SIZE_LIMIT))
        )
      )
        .then((data) => [].concat(...data))
        .then(dataParser);
    }
  });
};
