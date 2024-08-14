import PropTypes from "prop-types";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getMonthlyConfig from "../charts/temperatureMonthly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import useEarthEngineClimateNormals from "../../../hooks/useEarthEngineClimateNormals";

const dataset = {
  datasetId: "ECMWF/ERA5_LAND/MONTHLY",
  band: "temperature_2m",
};

const testPeriod = { startDate: "2023-01", endDate: "2024-08" };

const TemperatureMonthly = ({ orgUnit, period, referencePeriod }) => {
  const data = useEarthEngineTimeSeries(dataset, testPeriod, orgUnit.geometry);

  /*
  const normals = useEarthEngineClimateNormals(
    dataset,
    referencePeriod,
    orgUnit
  );
  */

  /*
  if (!monthlyPeriod || !monthlyData || !dailyData) {
    return <DataLoader height={400} />;
  }
    */

  console.log("TemperatureMonthly", orgUnit, period, referencePeriod, data);

  return <DataLoader height={400} />;

  /*
  return (
    <Chart
      config={getMonthlyConfig(
        name,
        monthlyData,
        monthlyPeriod,
        referencePeriod
      )}
    />
  );
  */
};

TemperatureMonthly.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  periodType: PropTypes.string.isRequired,
  referencePeriod: PropTypes.object.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
};

export default TemperatureMonthly;
