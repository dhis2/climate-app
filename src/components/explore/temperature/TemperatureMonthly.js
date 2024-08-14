import PropTypes from "prop-types";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getMonthlyConfig from "../charts/temperatureMonthly";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import useEarthEngineClimateNormals from "../../../hooks/useEarthEngineClimateNormals";

const datasetId = "ECMWF/ERA5_LAND/MONTHLY_AGGR";
const dataBands = [
  "temperature_2m",
  "temperature_2m_min",
  "temperature_2m_max",
];
const normalBand = "temperature_2m";

const dataset = {
  datasetId: "ECMWF/ERA5_LAND/MONTHLY_AGGR",
  band: ["temperature_2m", "temperature_2m_min", "temperature_2m_max"],
};

const testPeriod = { startDate: "2023-08", endDate: "2024-07" };

const TemperatureMonthly = ({ orgUnit, period, referencePeriod }) => {
  const data = useEarthEngineTimeSeries(dataset, testPeriod, orgUnit.geometry);

  console.log("period", period);

  const normals = useEarthEngineClimateNormals(
    datasetId,
    normalBand,
    referencePeriod,
    orgUnit
  );

  if (!data || !normals) {
    return <DataLoader height={400} />;
  }

  return (
    <Chart
      config={getMonthlyConfig(
        orgUnit.properties.name,
        data,
        normals,
        referencePeriod
      )}
    />
  );
};

TemperatureMonthly.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
  referencePeriod: PropTypes.object.isRequired,
};

export default TemperatureMonthly;
