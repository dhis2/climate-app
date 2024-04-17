import { useState, useEffect } from "react";
import useEarthEngine from "./useEarthEngine";
import { getClimateProjections } from "../utils/ee-utils";
import { temperatureParser } from "../data/datasets";

const dataset = {
  datasetId: "NASA/GDDP-CMIP6",
  band: "tas",
  model: "ACCESS-CM2",
  scenario: "ssp245", // "ssp245"
  valueParser: temperatureParser,
};

const period = {
  startYear: 2020,
  endYear: 2100,
};

const useClimateProjections = (geometry) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const eePromise = useEarthEngine();

  useEffect(() => {
    if (dataset && geometry) {
      setLoading(true);
      setData();
      eePromise.then((ee) =>
        getClimateProjections(ee, dataset, period, geometry)
          .then((data) => {
            setData(data);
            setLoading(false);
          })
          .catch((error) => {
            setError(error);
            setLoading(false);
          })
      );
    }
  }, [eePromise, dataset, period, geometry]);

  return { data, error, loading };
};

export default useClimateProjections;
