import { useOutletContext } from "react-router-dom";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getDailyConfig from "./charts/temperatureDaily";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import explorePeriodStore from "../../../utils/explorePeriodStore";
import { era5Daily } from "../../../data/datasets";

const TemperatureDaily = () => {
  const orgUnit = useOutletContext();
  const { dailyPeriod } = explorePeriodStore();

  const data = useEarthEngineTimeSeries(era5Daily, dailyPeriod, orgUnit);

  if (!data) {
    return <DataLoader />;
  }

  return <Chart config={getDailyConfig(orgUnit.properties.name, data)} />;
};

export default TemperatureDaily;
