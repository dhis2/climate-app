import { useState, useEffect } from "react";
import useEarthEngine from "./useEarthEngine";
import { getEarthEngineData } from "../util/ee-utils";

const useEarthEngineData = (dataset, period, features) => {
  const [data, setData] = useState();
  const eePromise = useEarthEngine();

  useEffect(() => {
    if (dataset && features) {
      eePromise.then((ee) =>
        getEarthEngineData(ee, dataset, period, features).then(setData)
      );
    }
  }, [eePromise, dataset, features]);

  return data;
};

export default useEarthEngineData;
