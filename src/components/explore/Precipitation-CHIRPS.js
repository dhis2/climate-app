import Chart from "./Chart";
import useEarthEngineData from "../../hooks/useEarthEngineData";
import datasets from "../../data/datasets";
import getPrecipitationChart from "./charts/precipitation-CHIRPS";

const precipitation = datasets.find(
  (d) => d.id === "UCSB-CHG/CHIRPS/DAILY/precipitation"
);

const Precipitation = ({ orgUnit, period }) => {
  const values = useEarthEngineData(precipitation, period, orgUnit);

  if (!values) {
    return <div>Loading...</div>;
  }

  return <Chart config={getPrecipitationChart(values)} />;
};

export default Precipitation;
