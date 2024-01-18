import Chart from "./Chart";
import useEarthEngineData from "../../hooks/useEarthEngineData";
import datasets from "../../data/datasets";
import getTemperatureChart from "./charts/temperatureDaily";

const meanTemperature = datasets.find(
  (d) => d.id === "ECMWF/ERA5_LAND/HOURLY/temperature_2m"
);

const minTemperature = datasets.find(
  (d) => d.id === "ECMWF/ERA5_LAND/HOURLY/temperature_2m_min"
);

const maxTemperature = datasets.find(
  (d) => d.id === "ECMWF/ERA5_LAND/HOURLY/temperature_2m_max"
);

const Temperature = ({ orgUnit, period }) => {
  const meanValues = useEarthEngineData(meanTemperature, period, orgUnit);
  const minValues = useEarthEngineData(minTemperature, period, orgUnit);
  const maxValues = useEarthEngineData(maxTemperature, period, orgUnit);

  if (!meanValues || !minValues || !maxValues) {
    return <div>Loading...</div>;
  }

  return (
    <Chart config={getTemperatureChart(meanValues, minValues, maxValues)} />
  );
};

export default Temperature;
