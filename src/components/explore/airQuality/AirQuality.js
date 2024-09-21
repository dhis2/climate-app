import Chart from "../Chart";
import DailyPeriodSelect from "../DailyPeriodSelect";
import DataLoader from "../../shared/DataLoader";
import Resolution from "../../shared/Resolution";
import getParticulateMatterConfig from "./charts/particulateMatter";
import getCarbonMonoxideConfig from "./charts/carbonMonoxide";
import getNitrogetDioxideConfig from "./charts/nitrogenDioxide";
import getSulfurDioxideConfig from "./charts/sulfurDioxide";
import exploreStore from "../../../utils/exploreStore";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import { camsDaily } from "../../../data/datasets";

const filter = [
  {
    type: "eq",
    arguments: ["model_forecast_hour", 0],
  },
  {
    type: "eq",
    arguments: ["model_initialization_hour", 0],
  },
];

const AirQuality = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const period = exploreStore((state) => state.dailyPeriod);

  const data = useEarthEngineTimeSeries(camsDaily, period, orgUnit, filter);

  const { name } = orgUnit.properties;

  return (
    <>
      {data ? (
        <>
          <Chart config={getParticulateMatterConfig(name, data)} />
          <Chart config={getCarbonMonoxideConfig(name, data)} />
          <Chart config={getNitrogetDioxideConfig(name, data)} />
          <Chart config={getSulfurDioxideConfig(name, data)} />
        </>
      ) : (
        <DataLoader />
      )}
      <DailyPeriodSelect />
      <Resolution resolution={camsDaily.resolution} />
    </>
  );
};

export default AirQuality;
