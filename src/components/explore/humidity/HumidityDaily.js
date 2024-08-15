import PropTypes from "prop-types";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getDailyConfig from "./charts/humidityDaily";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import { era5Daily } from "../../../data/datasets";

const HumidityDaily = ({ orgUnit, period }) => {
  const data = useEarthEngineTimeSeries(era5Daily, period, orgUnit);

  if (!data) {
    return <DataLoader height={400} />;
  }

  return <Chart config={getDailyConfig(orgUnit.properties.name, data)} />;
};

HumidityDaily.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
};

export default HumidityDaily;
