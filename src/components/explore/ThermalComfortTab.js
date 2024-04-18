import PropTypes from "prop-types";
import useEarthEngineTimeSeries from "../../hooks/useEarthEngineTimeSeries";
import Chart from "./Chart";
import DataLoader from "../shared/DataLoader";
import getDailyConfig from "./charts/thermalComfortDaily";
import getMonthlyConfig from "./charts/thermalComfortMonthly";

const dataset = {
  datasetId: "projects/climate-engine-pro/assets/ce-era5-heat",
  band: ["utci_mean", "utci_min", "utci_max"],
  reducer: ["mean", "min", "max"],
  periodType: "daily",
  skipIndex: [
    // TODO: Request missing data on GEE?
    "20231111",
    "20231114",
    "20231212",
    "20240104",
    "20240110",
    "20240111",
  ],
};

const ThermalComfortTab = ({
  name,
  periodType,
  monthlyPeriod,
  monthlyData,
  dailyPeriod,
  geometry,
}) => {
  const dailyThermal = useEarthEngineTimeSeries(dataset, dailyPeriod, geometry);
  const monthlyThermal = useEarthEngineTimeSeries(
    dataset,
    monthlyPeriod,
    geometry
  );

  if (!monthlyThermal || !dailyThermal) {
    return <DataLoader height={400} />;
  }

  return periodType === "monthly" ? (
    <Chart
      config={getMonthlyConfig(
        name,
        monthlyThermal,
        monthlyPeriod,
        monthlyData
      )}
    />
  ) : (
    <Chart config={getDailyConfig(name, dailyThermal)} />
  );
};

ThermalComfortTab.propTypes = {
  name: PropTypes.string.isRequired,
  geometry: PropTypes.object.isRequired,
  dailyPeriod: PropTypes.object,
};

export default ThermalComfortTab;
