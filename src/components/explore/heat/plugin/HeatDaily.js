import Chart from "../../Chart";
import DataLoader from "../../../shared/DataLoader";
import getDailyConfig from "../charts/thermalComfortDaily";
import useEarthEngineTimeSeries from "../../../../hooks/useEarthEngineTimeSeries";
import useAppSettings from "../../../../hooks/useAppSettings";
import { era5HeatDaily } from "../../../../data/datasets";

const HeatDaily = ({ orgUnit, period }) => {
  const { settings } = useAppSettings();

  const data = useEarthEngineTimeSeries(era5HeatDaily, period, orgUnit);

  const isPlugin = true;

  return data ? (
    <Chart
      config={getDailyConfig(orgUnit.properties.name, data, settings, isPlugin)}
      isPlugin={isPlugin}
    />
  ) : (
    <DataLoader />
  );
};

export default HeatDaily;
