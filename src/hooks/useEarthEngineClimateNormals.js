import { useState, useEffect } from "react";
import useEarthEngine from "./useEarthEngine";
import { getClimateNormals } from "../utils/ee-utils";

// TODO: Reuse this function
const getKey = ({ datasetId, band }, { startTime, endTime }, { id }) =>
  `${id}-${datasetId}-${band.join("-")}-${startTime}-${endTime}`;

const cachedPromise = {};

const useEarthEngineClimateNormals = (dataset, period, feature) => {
  const [data, setData] = useState();
  const eePromise = useEarthEngine();

  useEffect(() => {
    let canceled = false;

    if (dataset && period && feature) {
      const key = getKey(dataset, period, feature);

      if (cachedPromise[key]) {
        cachedPromise[key].then((data) => {
          if (!canceled) {
            setData(data);
          }
        });

        return () => {
          canceled = true;
        };
      }

      setData();
      eePromise.then((ee) => {
        cachedPromise[key] = getClimateNormals(
          ee,
          dataset,
          period,
          feature.geometry
        );

        cachedPromise[key].then((data) => {
          if (!canceled) {
            setData(data);
          }
        });
      });

      return () => {
        canceled = true;
      };
    }
  }, [eePromise, dataset, period, feature]);

  return data;
};

export default useEarthEngineClimateNormals;
