import Chart from "./Chart";
import useEarthEngineData from "../../hooks/useEarthEngineData";
import datasets from "../../data/datasets";
import getPrecipitationChart from "./charts/precipitationDaily";

const precipitation = datasets.find(
  (d) => d.id === "ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum"
);

const Precipitation = ({ orgUnit, period }) => {
  const values = useEarthEngineData(precipitation, period, orgUnit);

  if (!values) {
    return <div>Loading...</div>;
  }

  return <Chart config={getPrecipitationChart(values)} />;
};

export default Precipitation;
