import { useState, useEffect } from "react";
import useEarthEngine from "./useEarthEngine";
import { getEarthEngineData } from "../utils/ee-utils";

const useEarthEngineData = (dataset, period, features) => {
  const [data, setData] = useState();
  const eePromise = useEarthEngine();

  useEffect(() => {
    if (dataset && features?.length) {
      setData();
      eePromise.then((ee) =>
        getEarthEngineData(ee, dataset, period, features).then(setData)
      );
    }
  }, [eePromise, dataset, period, features]);

  return data;
};

export default useEarthEngineData;
