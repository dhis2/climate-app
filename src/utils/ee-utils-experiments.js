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

export const hourlyToDaily = () => {};

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
        data.map((d) => ({
          ou: d.id,
          period: d.date,
          value: valueParser(d.value),
        }))
    : (data) => data;

  const collection = ee
    .ImageCollection(datasetId)
    .select(band)
    .filter(ee.Filter.date(timeZoneStart, timeZoneEnd));

  const eeScale = getScale(collection.first());

  const featureCollection = ee.FeatureCollection(features);

  const eeReducer = ee.Reducer[reducer]();

  let dailyCollection;

  /*
  if (periodType === "hourly") {
    const days = ee
      .Date(timeZoneEnd)
      .difference(ee.Date(timeZoneStart), "days");

    const daysList = ee.List.sequence(0, days.subtract(1));

    dailyCollection = ee.ImageCollection.fromImages(
      daysList.map((day) => {
        const startUTC = ee.Date(startDate).advance(day, "days");

        const start = startUTC.format(null, timeZone);

        const end = ee
          .Date(startDate)
          .advance(ee.Number(day).add(1), "days")
          .format(null, timeZone);

        const filtered = collection.filter(ee.Filter.date(start, end));

        return filtered[periodReducer]()
          .set("system:index", startUTC.format("YYYYMMdd"))
          .set("system:time_start", start)
          .set("system:time_end", end)
          .set("count", filtered.size());
      })
    );
  }
  */

  /*
  const reduced = (dailyCollection || collection)
    .map((image) =>
      image
        .reduceRegions({
          collection: featureCollection,
          reducer: eeReducer,
          scale: eeScale,
        })
    )
    .flatten();
    */

  /*
    const valueCollection = ee.FeatureCollection(
      reduced.map((feature) =>
        ee.Feature(null, {
          value: feature.get(reducer),
        })
      )
    );
    */

  const reduced = (dailyCollection || collection)
    .map((image) =>
      image
        .reduceRegions({
          collection: featureCollection,
          reducer: eeReducer,
          scale: eeScale,
        })
        .map((feature) =>
          // feature.set("system:time_start", image.date().format())
          ee.Feature(null, {
            ou: feature.get("id"),
            "system:time_start": image.date().format(),
            value: feature.get(reducer),
          })
        )
    )
    .flatten();

  /*
   * CAUTION: ee.FeatureCollection.iterate can be less efficient than alternative
   * solutions implemented using ee.FeatureCollection.map or by converting feature
   * properties to an ee.Array object and using ee.Array.slice and
   * ee.Array.arrayAccum methods. Avoid ee.FeatureCollection.iterate if possible.
   */

  if (periodType === "hourly") {
    const days = ee
      .Date(timeZoneEnd)
      .difference(ee.Date(timeZoneStart), "days");

    const daysList = ee.List.sequence(0, days.subtract(1));

    const orgUnits = ee.List(features.map((f) => f.id));

    const test = orgUnits.map((ou) => {
      // const orgUnitItems = reduced.filter(ee.Filter.eq("ou", ou));

      /*
      return {
        count: orgUnitItems.size(),
      };
      */

      return daysList.map((day) => {
        const startUTC = ee.Date(startDate).advance(day, "days");
        const start = startUTC.format(null, timeZone);
        const end = ee.Date(start).advance(1, "days").format(null, timeZone);

        const value = reduced
          .filter(ee.Filter.eq("ou", ou))
          .filter(ee.Filter.date(start, end))
          .aggregate_mean("value");

        // const dayItems = reduced.filter(ee.Filter.date(start, end));

        return ee.Dictionary({
          ou: ou,
          period: startUTC.format("YYYYMMdd"),
          start,
          end,
          value,
        });
      });

      /*
        return daysList.map((day) => {
          const startUTC = ee.Date(startDate).advance(day, "days");
          const start = startUTC.format(null, timeZone);
          const end = ee
            .Date(startDate)
            .advance(ee.Number(day).add(1), "days")
            .format(null, timeZone);

          const dayItems = orgUnitItems.filter(ee.Filter.date(start, end));

          return ee.Dictionary({
            count: dayItems.size(),
          });
        });
        */
    });
    // .flatten();

    getInfo(test).then(console.log);

    /*


    const test = featureCollection.map((feature) => {
      const id = feature.get("id");
      const filteredA = reduced.filter(
        ee.Filter.stringEndsWith("system:index", id)
      );

      return daysList.map((day) => {
        // const day = 0;
        const startUTC = ee.Date(startDate).advance(day, "days");
        const start = startUTC.format(null, timeZone);
        const end = ee
          .Date(startDate)
          .advance(ee.Number(day).add(1), "days")
          .format(null, timeZone);

        const filtered = filteredA.filter(ee.Filter.date(start, end));

        // getInfo(start).then(console.log);
        // getInfo(end).then(console.log);
        // getInfo(filtered).then(console.log);

        // const test = filtered.aggregate_mean("mean");

        // getInfo(test).then(console.log);
        

        // return ee.Dictionary({
        //   ou: "O6uvpzGd5pu",
        //   period: startUTC.format("YYYYMMdd"),
        //  value: filtered.aggregate_mean("mean"),
        //});
        

        return ee.Feature(null, {
          id: id,
          period: startUTC.format("YYYYMMdd"),
          value: filtered.aggregate_mean("mean"),
        });
      });
    });

    getInfo(test).then(console.log);
    */
  }

  /*  
  const test = reduced
    .filter(ee.Filter.stringStartsWith("system:index", "20230701"))
    .filter(ee.Filter.stringEndsWith("system:index", "O6uvpzGd5pu"));

  // getInfo(test.size()).then(console.log);
  getInfo(reduced.limit(1)).then(console.log);
  */

  /*
  const valueCollection = ee.FeatureCollection(
    reduced.map((feature) =>
      ee.Feature(null, {
        value: feature.get(reducer),
      })
    )
  );
  */

  const valueCollection = ee.FeatureCollection(reduced);
  /*
  const valueCollection = ee.FeatureCollection(
    reduced.map((feature) =>
      ee.Feature(null, {
        id: feature.get("id"),
        time: ee.String(feature.get("system:index")).slice(0, 11),
        value: feature.get(reducer),
      })
    )
  );
  */

  // getInfo(reduced.limit(1)).then(console.log);
  // getInfo(valueCollection.limit(1)).then(console.log);

  return getInfo(valueCollection.size()).then((size) => {
    if (size <= SIZE_LIMIT) {
      return getInfo(valueCollection.toList(SIZE_LIMIT))
        .then(cleanData)
        .then(dataParser);
    } else {
      const chunks = Math.ceil(size / SIZE_LIMIT);

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

export const hourlyToDaily = () => {};

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
        data.map((d) => ({
          ou: d.id,
          period: d.date,
          value: valueParser(d.value),
        }))
    : (data) => data;

  const collection = ee
    .ImageCollection(datasetId)
    .select(band)
    .filter(ee.Filter.date(timeZoneStart, timeZoneEnd));

  const eeScale = getScale(collection.first());

  const featureCollection = ee.FeatureCollection(features);

  const eeReducer = ee.Reducer[reducer]();

  let dailyCollection;

  /*
  if (periodType === "hourly") {
    const days = ee
      .Date(timeZoneEnd)
      .difference(ee.Date(timeZoneStart), "days");

    const daysList = ee.List.sequence(0, days.subtract(1));

    dailyCollection = ee.ImageCollection.fromImages(
      daysList.map((day) => {
        const startUTC = ee.Date(startDate).advance(day, "days");

        const start = startUTC.format(null, timeZone);

        const end = ee
          .Date(startDate)
          .advance(ee.Number(day).add(1), "days")
          .format(null, timeZone);

        const filtered = collection.filter(ee.Filter.date(start, end));

        return filtered[periodReducer]()
          .set("system:index", startUTC.format("YYYYMMdd"))
          .set("system:time_start", start)
          .set("system:time_end", end)
          .set("count", filtered.size());
      })
    );
  }
  */

  /*
  const reduced = (dailyCollection || collection)
    .map((image) =>
      image
        .reduceRegions({
          collection: featureCollection,
          reducer: eeReducer,
          scale: eeScale,
        })
    )
    .flatten();
    */

  const reduced = (dailyCollection || collection)
    .map((image) =>
      image
        .reduceRegions({
          collection: featureCollection,
          reducer: eeReducer,
          scale: eeScale,
        })
        .map((feature) =>
          feature.set("system:time_start", image.date().format())
        )
    )
    .flatten();

  getInfo(reduced.limit(1)).then(console.log);

  if (periodType === "hourly") {
    const days = ee
      .Date(timeZoneEnd)
      .difference(ee.Date(timeZoneStart), "days");

    const daysList = ee.List.sequence(0, days.subtract(1));

    // daysList.map((day) => {
    const day = 0;
    const startUTC = ee.Date(startDate).advance(day, "days");
    const start = startUTC.format(null, timeZone);
    const end = ee
      .Date(startDate)
      .advance(ee.Number(day).add(1), "days")
      .format(null, timeZone);

    const filtered = reduced
      .filter(ee.Filter.stringEndsWith("system:index", "O6uvpzGd5pu"))
      .filter(ee.Filter.date(start, end));

    getInfo(start).then(console.log);
    getInfo(end).then(console.log);
    getInfo(filtered).then(console.log);

    const test = filtered.aggregate_mean("mean");

    getInfo(test).then(console.log);
    // return null;
    // });
  }

  /*  
  const test = reduced
    .filter(ee.Filter.stringStartsWith("system:index", "20230701"))
    .filter(ee.Filter.stringEndsWith("system:index", "O6uvpzGd5pu"));

  // getInfo(test.size()).then(console.log);
  getInfo(reduced.limit(1)).then(console.log);
  */

  const valueCollection = ee.FeatureCollection(
    reduced.map((feature) =>
      ee.Feature(null, {
        value: feature.get(reducer),
      })
    )
  );

  /*
  const valueCollection = ee.FeatureCollection(
    reduced.map((feature) =>
      ee.Feature(null, {
        id: feature.get("id"),
        time: ee.String(feature.get("system:index")).slice(0, 11),
        value: feature.get(reducer),
      })
    )
  );
  */

  // getInfo(reduced.limit(1)).then(console.log);
  // getInfo(valueCollection.limit(1)).then(console.log);

  return getInfo(valueCollection.size()).then((size) => {
    if (size <= SIZE_LIMIT) {
      return getInfo(valueCollection.toList(SIZE_LIMIT))
        .then(cleanData)
        .then(dataParser);
    } else {
      const chunks = Math.ceil(size / SIZE_LIMIT);

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

export const cleanData = (data) => {
  /*
  console.log(
    "cleanData",
    data.map((f) => f.properties)
  );
  */

  /*
  return data.map((f) => ({
    id: f.id.substring(9),
    date: f.id.slice(0, 8),
    value: f.properties.value,
  }));
  */

  return data.map((f) => f.properties);
};

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

  // let dailyCollection;

  /*
  if (periodType === "hourly") {
    const days = ee
      .Date(timeZoneEnd)
      .difference(ee.Date(timeZoneStart), "days");

    const daysList = ee.List.sequence(0, days.subtract(1));

    dailyCollection = ee.ImageCollection.fromImages(
      daysList.map((day) => {
        const startUTC = ee.Date(startDate).advance(day, "days");

        const start = startUTC.format(null, timeZone);

        const end = ee
          .Date(startDate)
          .advance(ee.Number(day).add(1), "days")
          .format(null, timeZone);

        const filtered = collection.filter(ee.Filter.date(start, end));

        return (
          filtered[periodReducer]()
            // .multiply(24)
            .set("system:index", startUTC.format("YYYYMMdd"))
            .set("system:time_start", start)
            .set("system:time_end", end)
            .set("count", filtered.size())
        );
      })
    );
  }
  */

  // const reduced = (dailyCollection || collection)
  const reduced = collection
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
            period: image
              .date()
              .format(periodType === "hourly" ? "YYYYMMdd'T'HH" : "YYYYMMdd"),
            value: feature.get(reducer),
          })
        )
    )
    .flatten();

  // getInfo(reduced.limit(100)).then(console.log);

  /*  
  const valueCollection = ee.FeatureCollection(
    reduced.map((feature) =>
      ee.Feature(null, {
        value: feature.get(reducer),
      })
    )
  );
  */

  /*
  const test = reduced.map((feature) =>
    feature.toDictionary(["ou", "system:time_start", "value"])
  );

  getInfo(test).then((data) => console.log(data));
  */

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
