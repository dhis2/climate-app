import { useState, useEffect } from "react";
import useEarthEngine from "./useEarthEngine";
import { getTimeSeriesData } from "../utils/ee-utils";

const getPeridFromId = (id) => {
  const year = id.slice(0, 4);
  const month = id.slice(4, 6);
  const day = id.slice(6, 8);
  return `${year}-${month}${day ? `-${day}` : ""}`;
};

const parseIds = (data) =>
  data.map((d) => ({ ...d, id: getPeridFromId(d.id) }));

// TODO: Reuse this function
const getKey = ({ datasetId, band }, { startTime, endTime }, { id }) =>
  `${id}-${datasetId}-${band.join("-")}-${startTime}-${endTime}`;

const cache = {};

const useEarthEngineTimeSeries = (dataset, period, feature) => {
  const [data, setData] = useState();
  const eePromise = useEarthEngine();

  useEffect(() => {
    if (dataset && period && feature) {
      const key = getKey(dataset, period, feature);

      if (cache[key]) {
        setData(cache[key]);
        return;
      }

      setData();
      eePromise.then((ee) =>
        getTimeSeriesData(ee, dataset, period, feature.geometry)
          .then(parseIds)
          .then((data) => {
            cache[key] = data;
            setData(data);
          })
      );
    }
  }, [eePromise, dataset, period, feature]);

  return data;
};

export default useEarthEngineTimeSeries;
