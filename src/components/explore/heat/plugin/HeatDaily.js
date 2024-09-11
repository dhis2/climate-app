import Chart from "../../Chart";
import DataLoader from "../../../shared/DataLoader";
import getDailyConfig from "../charts/thermalComfortDaily";
import useEarthEngineTimeSeries from "../../../../hooks/useEarthEngineTimeSeries";
import { heatDataset } from "../HeatDaily";

const HeatDaily = ({ orgUnit, period }) => {
  const data = useEarthEngineTimeSeries(heatDataset, period, orgUnit);
  const isPlugin = true;

  return data ? (
    <Chart
      config={getDailyConfig(orgUnit.properties.name, data, isPlugin)}
      isPlugin={isPlugin}
    />
  ) : (
    <DataLoader />
  );
};

export default HeatDaily;
