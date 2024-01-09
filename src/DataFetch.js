import { useState, useEffect } from "react";
import DataTable from "./DataTable";
import useEarthEngine from "./hooks/useEarthEngine";
import { getEarthEngineData } from "./lib/ee-utils";

const datasetParams = {
  datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
  band: "temperature_2m",
  reducer: "mean",
  startDate: "2023-12-15",
  endDate: "2024-01-01", // not including
  valueParser: (v) => Math.round((v - 273.15) * 10) / 10, // kelvin to celsius with one decimal
};

const DataFetch = ({ orgUnits }) => {
  const [data, setData] = useState(null);
  const eePromise = useEarthEngine();

  useEffect(() => {
    eePromise.then((ee) =>
      getEarthEngineData(ee, datasetParams, orgUnits).then(setData)
    );
  }, [eePromise, orgUnits]);

  return data ? (
    <DataTable data={data} orgUnits={orgUnits} />
  ) : (
    <div>Fetching data values...</div>
  );
};

export default DataFetch;
