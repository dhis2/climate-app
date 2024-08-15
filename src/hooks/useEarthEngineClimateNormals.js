import { useState, useEffect } from "react";
import useEarthEngine from "./useEarthEngine";
import { getClimateNormals } from "../utils/ee-utils";

// TODO: Reuse this function
const getKey = ({ datasetId, band }, { startTime, endTime }, { id }) =>
  `${id}-${datasetId}-${band.join("-")}-${startTime}-${endTime}`;

const cache = {};

const useEarthEngineClimateNormals = (dataset, period, feature) => {
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
      eePromise.then((ee) => {
        getClimateNormals(ee, dataset, period, feature.geometry).then(
          (data) => {
            cache[key] = data;
            setData(data);
          }
        );
      });
    }
  }, [eePromise, dataset, period, feature]);

  return data;
};

export default useEarthEngineClimateNormals;
