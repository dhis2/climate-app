import Chart from "../Chart";
import PeriodTypeSelect from "../PeriodTypeSelect";
import DailyPeriodSelect from "../DailyPeriodSelect";
import DataLoader from "../../shared/DataLoader";
import Resolution from "../../shared/Resolution";
import HeatDescription from "./HeatDescription";
import getDailyConfig from "./charts/thermalComfortDaily";
import exploreStore from "../../../utils/exploreStore";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import { era5HeatDaily } from "../../../data/datasets";

const HeatDaily = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const period = exploreStore((state) => state.dailyPeriod);

  const data = useEarthEngineTimeSeries(era5HeatDaily, period, orgUnit);

  return (
    <>
      <PeriodTypeSelect />
      {data ? (
        <Chart config={getDailyConfig(orgUnit.properties.name, data)} />
      ) : (
        <DataLoader />
      )}
      <DailyPeriodSelect />
      <HeatDescription />
      <Resolution resolution={era5HeatDaily.resolution} />
    </>
  );
};

export default HeatDaily;
