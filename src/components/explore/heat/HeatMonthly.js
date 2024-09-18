import Chart from "../Chart";
import PeriodTypeSelect from "../PeriodTypeSelect";
import MonthlyPeriodSelect from "../MonthlyPeriodSelect";
import DataLoader from "../../shared/DataLoader";
import getMonthlyConfig from "./charts/thermalComfortMonthly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import exploreStore from "../../../utils/exploreStore";
import { era5HeatMonthly } from "../../../data/datasets";

const HeatMonthly = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const period = exploreStore((state) => state.monthlyPeriod);

  const data = useEarthEngineTimeSeries(era5HeatMonthly, period, orgUnit);

  return (
    <>
      <PeriodTypeSelect />
      {data ? (
        <Chart config={getMonthlyConfig(orgUnit.properties.name, data)} />
      ) : (
        <DataLoader />
      )}
      <MonthlyPeriodSelect />
    </>
  );
};

export default HeatMonthly;
