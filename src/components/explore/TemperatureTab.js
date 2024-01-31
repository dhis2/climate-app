import PropTypes from "prop-types";
import Chart from "./Chart";
import getMonthlyConfig from "./charts/temperatureMonthly";
import getDailyConfig from "./charts/temperatureDaily";

const TemperatureTab = ({
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

TemperatureTab.propTypes = {
  periodType: PropTypes.string.isRequired,
  monthlyData: PropTypes.array.isRequired,
  dailyData: PropTypes.array.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
};

export default TemperatureTab;
