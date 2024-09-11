import Chart from "../Chart";
import PeriodTypeSelect from "../PeriodTypeSelect";
import DailyPeriodSelect from "../DailyPeriodSelect";
import DataLoader from "../../shared/DataLoader";
import getDailyConfig from "./charts/precipitationDaily";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import exploreStore from "../../../utils/exploreStore";
import { era5Daily } from "../../../data/datasets";

const PrecipitationDaily = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const period = exploreStore((state) => state.dailyPeriod);

  const data = useEarthEngineTimeSeries(era5Daily, period, orgUnit);

  return (
    <>
      <PeriodTypeSelect />
      {data ? (
        <Chart config={getDailyConfig(orgUnit.properties.name, data)} />
      ) : (
        <DataLoader />
      )}
      <DailyPeriodSelect />
    </>
  );
};

export default PrecipitationDaily;
