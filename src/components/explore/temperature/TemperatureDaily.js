import Chart from "../Chart";
import PeriodTypeSelect from "../PeriodTypeSelect";
import DailyPeriodSelect from "../DailyPeriodSelect";
import DataLoader from "../../shared/DataLoader";
import Resolution from "../../shared/Resolution";
import getDailyConfig from "./charts/temperatureDaily";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import exploreStore from "../../../store/exploreStore";
import useAppSettings from "../../../hooks/useAppSettings";
import { era5Daily } from "../../../data/datasets";

const TemperatureDaily = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const period = exploreStore((state) => state.dailyPeriod);
  const { settings } = useAppSettings();

  const data = useEarthEngineTimeSeries(era5Daily, period, orgUnit);

  return (
    <>
      <PeriodTypeSelect />
      {data ? (
        <Chart
          config={getDailyConfig(orgUnit.properties.name, data, settings)}
        />
      ) : (
        <DataLoader />
      )}
      <DailyPeriodSelect />
      <Resolution resolution={era5Daily.resolution} />
    </>
  );
};

export default TemperatureDaily;
