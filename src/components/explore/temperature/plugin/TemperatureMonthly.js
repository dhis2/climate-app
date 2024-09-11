import PropTypes from "prop-types";
import Chart from "../../Chart";
import DataLoader from "../../../shared/DataLoader";
import getMonthlyConfig from "../charts/temperatureMonthly";
import useEarthEngineTimeSeries from "../../../../hooks/useEarthEngineTimeSeries";
import useEarthEngineClimateNormals from "../../../../hooks/useEarthEngineClimateNormals";
import { era5Monthly, era5MonthlyNormals } from "../../../../data/datasets";
import { referencePeriods } from "../../ReferencePeriodSelect";

const TemperatureMonthly = ({ orgUnit, period, referencePeriod }) => {
  const data = useEarthEngineTimeSeries(era5Monthly, period, orgUnit);

  const normals = useEarthEngineClimateNormals(
    era5MonthlyNormals,
    referencePeriod,
    orgUnit
  );

  const isPlugin = true;

  return data && normals ? (
    <Chart
      config={getMonthlyConfig(
        orgUnit.properties.name,
        data,
        normals,
        referencePeriod,
        isPlugin
      )}
      isPlugin={isPlugin}
    />
  ) : (
    <DataLoader />
  );
};

TemperatureMonthly.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
  referencePeriod: PropTypes.oneOf(referencePeriods).isRequired,
};

export default TemperatureMonthly;
