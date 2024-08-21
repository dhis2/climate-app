import PropTypes from "prop-types";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getMonthlyConfig from "./charts/thermalComfortMonthly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import { heatDataset } from "./HeatDaily";
import { MONTHLY } from "../../../utils/time";

const dataset = {
  ...heatDataset,
  aggregationPeriod: MONTHLY,
};

const HeatMonthly = ({ orgUnit, period }) => {
  const data = useEarthEngineTimeSeries(dataset, period, orgUnit);

  if (!data) {
    return <DataLoader />;
  }

  return <Chart config={getMonthlyConfig(orgUnit.properties.name, data)} />;
};

HeatMonthly.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
};

export default HeatMonthly;
