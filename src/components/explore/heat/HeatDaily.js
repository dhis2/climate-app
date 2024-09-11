import Chart from "../Chart";
import PeriodTypeSelect from "../PeriodTypeSelect";
import DailyPeriodSelect from "../DailyPeriodSelect";
import DataLoader from "../../shared/DataLoader";
import getDailyConfig from "./charts/thermalComfortDaily";
import exploreStore from "../../../utils/exploreStore";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";

export const heatDataset = {
  datasetId: "projects/climate-engine-pro/assets/ce-era5-heat",
  band: ["utci_mean", "utci_min", "utci_max"],
  reducer: ["mean", "min", "max"],
  periodType: "daily",
};

const HeatDaily = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const period = exploreStore((state) => state.dailyPeriod);

  const data = useEarthEngineTimeSeries(heatDataset, period, orgUnit);

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

export default HeatDaily;
