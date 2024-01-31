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

const useEarthEngineTimeSeries = (dataset, period, geometry) => {
  const [data, setData] = useState();
  const eePromise = useEarthEngine();

  useEffect(() => {
    if (dataset && period && geometry) {
      setData();
      eePromise.then((ee) =>
        getTimeSeriesData(ee, dataset, period, geometry)
          .then(parseIds)
          .then(setData)
      );
    }
  }, [eePromise, dataset, period, geometry]);

  return data;
};

export default useEarthEngineTimeSeries;
