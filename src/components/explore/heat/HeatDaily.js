import PropTypes from "prop-types";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getDailyConfig from "./charts/thermalComfortDaily";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import { heatMissingDataIndex } from "../../../data/datasets";

export const heatDataset = {
  datasetId: "projects/climate-engine-pro/assets/ce-era5-heat",
  band: ["utci_mean", "utci_min", "utci_max"],
  reducer: ["mean", "min", "max"],
  periodType: "daily",
  skipIndex: heatMissingDataIndex,
};

const HeatDaily = ({ orgUnit, period }) => {
  const data = useEarthEngineTimeSeries(heatDataset, period, orgUnit);

  if (!data) {
    return <DataLoader />;
  }

  return <Chart config={getDailyConfig(orgUnit.properties.name, data)} />;
};

HeatDaily.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  period: PropTypes.object.isRequired,
};

export default HeatDaily;
