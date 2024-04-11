import PropTypes from "prop-types";
import Chart from "./Chart";
import DataLoader from "../shared/DataLoader";
import getMonthlyConfig from "./charts/humidityMonthly";
import getDailyConfig from "./charts/humidityDaily";

const HumidityTab = ({
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

HumidityTab.propTypes = {
  name: PropTypes.string.isRequired,
  periodType: PropTypes.string.isRequired,
  monthlyPeriod: PropTypes.object,
  monthlyData: PropTypes.array,
  dailyData: PropTypes.array,
  referencePeriod: PropTypes.string.isRequired,
};

export default HumidityTab;
