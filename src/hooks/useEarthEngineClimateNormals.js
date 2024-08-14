import { useState, useEffect } from "react";
import useEarthEngine from "./useEarthEngine";
import { getClimateNormals } from "../utils/ee-utils";

const useEarthEngineClimateNormals = (datasetId, band, period, feature) => {
  const [data, setData] = useState();
  const eePromise = useEarthEngine();

  const geometry = feature?.geometry;

  useEffect(() => {
    if (datasetId && band && period && geometry) {
      setData();
      eePromise.then((ee) => {
        getClimateNormals(ee, datasetId, band, period, geometry).then(setData);
      });
    }
  }, [eePromise, datasetId, band, period, geometry]);

  return data;
};

export default useEarthEngineClimateNormals;
