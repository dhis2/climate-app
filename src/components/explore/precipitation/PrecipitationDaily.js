import PropTypes from "prop-types";
import Chart from "../Chart";
import DataLoader from "../../shared/DataLoader";
import getMonthlyConfig from "../charts/temperatureMonthly";
import getDailyConfig from "../charts/temperatureDaily";

const TemperatureTab = ({
  name,
  periodType,
  monthlyData,
  dailyData,
  monthlyPeriod,
  referencePeriod,
}) => {
  if (!monthlyPeriod || !monthlyData || !dailyData) {
    return <DataLoader height={400} />;
  }

  return (
    <>
      {periodType === "monthly" ? (
        <Chart
          config={getMonthlyConfig(
            name,
            monthlyData,
            monthlyPeriod,
            referencePeriod
          )}
        />
      ) : (
        <Chart config={getDailyConfig(name, dailyData)} />
      )}
    </>
  );
};

TemperatureTab.propTypes = {
  name: PropTypes.string.isRequired,
  periodType: PropTypes.string.isRequired,
  referencePeriod: PropTypes.string.isRequired,
  monthlyPeriod: PropTypes.object,
  monthlyData: PropTypes.array,
  dailyData: PropTypes.array,
};

export default TemperatureTab;
