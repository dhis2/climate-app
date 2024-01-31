import PropTypes from "prop-types";
import Chart from "./Chart";
import getMonthlyConfig from "./charts/precipitationMonthly";
import getDailyConfig from "./charts/precipitationDaily";

const PrecipitationTab = ({
  periodType,
  monthlyData,
  dailyData,
  monthlyPeriod,
}) => (
  <>
    {periodType === "monthly" ? (
      <Chart config={getMonthlyConfig(monthlyData, monthlyPeriod)} />
    ) : (
      <Chart config={getDailyConfig(dailyData)} />
    )}
  </>
);

PrecipitationTab.propTypes = {
  periodType: PropTypes.string.isRequired,
  monthlyData: PropTypes.array.isRequired,
  dailyData: PropTypes.array.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
};

export default PrecipitationTab;
