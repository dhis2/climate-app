import { useState, useEffect } from "react";
import useEarthEngine from "./useEarthEngine";
import { getClimateNormals } from "../utils/ee-utils";

const useEarthEngineClimateNormals = (dataset, period, orgUnit) => {
  const [data, setData] = useState();
  const eePromise = useEarthEngine();

  const geometry = orgUnit?.geometry;

  useEffect(() => {
    if (dataset && period && geometry) {
      setData();
      eePromise.then((ee) => {
        getClimateNormals(ee, dataset, period, geometry).then(setData);
      });
    }
  }, [eePromise, dataset, period, geometry]);

  return data;
};

export default useEarthEngineClimateNormals;
