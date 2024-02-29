import PropTypes from "prop-types";
import Chart from "./Chart";
import getMonthlyConfig from "./charts/temperatureMonthly";
import getDailyConfig from "./charts/temperatureDaily";

const TemperatureTab = ({
  name,
  periodType,
  monthlyData,
  dailyData,
  monthlyPeriod,
}) => (
  <>
    {periodType === "monthly" ? (
      <Chart config={getMonthlyConfig(name, monthlyData, monthlyPeriod)} />
    ) : (
      <Chart config={getDailyConfig(name, dailyData)} />
    )}
  </>
);

TemperatureTab.propTypes = {
  name: PropTypes.string.isRequired,
  periodType: PropTypes.string.isRequired,
  monthlyData: PropTypes.array.isRequired,
  dailyData: PropTypes.array.isRequired,
  monthlyPeriod: PropTypes.object.isRequired,
};

export default TemperatureTab;
