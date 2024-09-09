import { useOutletContext } from "react-router-dom";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getDailyConfig from "./charts/humidityDaily";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import exploreStore from "../../../utils/exploreStore";
import { era5Daily } from "../../../data/datasets";

const HumidityDaily = () => {
  const orgUnit = useOutletContext();
  const period = exploreStore((state) => state.dailyPeriod);

  const data = useEarthEngineTimeSeries(era5Daily, period, orgUnit);

  if (!data) {
    return <DataLoader />;
  }

  return <Chart config={getDailyConfig(orgUnit.properties.name, data)} />;
};

export default HumidityDaily;
