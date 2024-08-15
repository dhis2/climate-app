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

const getKeyFromFilter = (filter) =>
  filter
    ? `-${filter.map((f) => `${f.type}-${f.arguments.join("-")}`).join("-")}`
    : "";

// TODO: Reuse this function
const getKey = ({ datasetId, band }, { startTime, endTime }, { id }, filter) =>
  `${id}-${datasetId}-${band.join(
    "-"
  )}-${startTime}-${endTime}${getKeyFromFilter(filter)}`;

const cachedPromise = {};

const useEarthEngineTimeSeries = (dataset, period, feature, filter) => {
  const [data, setData] = useState();
  const eePromise = useEarthEngine();

  useEffect(() => {
    let canceled = false;

    if (dataset && period && feature) {
      const key = getKey(dataset, period, feature, filter);

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
        cachedPromise[key] = getTimeSeriesData(
          ee,
          dataset,
          period,
          feature.geometry,
          filter
        ).then(parseIds);

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
  }, [eePromise, dataset, period, feature, filter]);

  return data;
};

export default useEarthEngineTimeSeries;
