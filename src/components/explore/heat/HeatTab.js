import PropTypes from "prop-types";
import HeatDaily from "./HeatDaily";
import HeatMonthly from "./HeatMonthly";
// import { heatMissingDataIndex } from "../../../data/datasets";
import { MONTHLY } from "../../../utils/time";

/*
const dataset = {
  datasetId: "projects/climate-engine-pro/assets/ce-era5-heat",
  band: ["utci_mean", "utci_min", "utci_max"],
  reducer: ["mean", "min", "max"],
  periodType: "daily",
  skipIndex: heatMissingDataIndex,
};
*/

/*
const HeatTab = ({
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

HeatTab.propTypes = {
  name: PropTypes.string.isRequired,
  geometry: PropTypes.object.isRequired,
  dailyPeriod: PropTypes.object,
};

export default HeatTab;
*/

const HeatTab = ({
  orgUnit,
  periodType,
  dailyPeriod,
  monthlyPeriod,
  referencePeriod,
}) => (
  <>
    {periodType === MONTHLY ? (
      <HeatMonthly
        orgUnit={orgUnit}
        period={monthlyPeriod}
        referencePeriod={referencePeriod}
      />
    ) : (
      <HeatDaily orgUnit={orgUnit} period={dailyPeriod} />
    )}
  </>
);

HeatTab.propTypes = {
  orgUnit: PropTypes.object.isRequired,
  periodType: PropTypes.string.isRequired,
  dailyPeriod: PropTypes.object.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
  referencePeriod: PropTypes.object.isRequired,
};

export default HeatTab;
