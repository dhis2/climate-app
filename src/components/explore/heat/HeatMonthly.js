import Chart from "../Chart";
import PeriodTypeSelect from "../PeriodTypeSelect";
import MonthlyPeriodSelect from "../MonthlyPeriodSelect";
import DataLoader from "../../shared/DataLoader";
import Resolution from "../../shared/Resolution";
import HeatDescription from "./HeatDescription";
import getMonthlyConfig from "./charts/thermalComfortMonthly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import exploreStore from "../../../store/exploreStore";
import useAppSettings from "../../../hooks/useAppSettings";
import { era5HeatMonthly } from "../../../data/datasets";

const HeatMonthly = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const period = exploreStore((state) => state.monthlyPeriod);
  const { settings } = useAppSettings();

  const data = useEarthEngineTimeSeries(era5HeatMonthly, period, orgUnit);

  return (
    <>
      <PeriodTypeSelect />
      {data && settings ? (
        <Chart
          config={getMonthlyConfig(orgUnit.properties.name, data, settings)}
        />
      ) : (
        <DataLoader />
      )}
      <MonthlyPeriodSelect />
      <HeatDescription />
      <Resolution resolution={era5HeatMonthly.resolution} />
    </>
  );
};

export default HeatMonthly;
