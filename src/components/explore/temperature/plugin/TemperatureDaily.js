import PropTypes from "prop-types";
import Chart from "../../Chart";
import DataLoader from "../../../shared/DataLoader";
import getDailyConfig from "../charts/temperatureDaily";
import useEarthEngineTimeSeries from "../../../../hooks/useEarthEngineTimeSeries";
import useAppSettings from "../../../../hooks/useAppSettings";
import { era5Daily } from "../../../../data/datasets";

const TemperatureDaily = ({ orgUnit, period }) => {
  const { settings } = useAppSettings();

  const data = useEarthEngineTimeSeries(era5Daily, period, orgUnit);

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

TemperatureDaily.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
};

export default TemperatureDaily;
