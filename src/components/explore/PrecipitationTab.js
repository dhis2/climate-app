import PropTypes from "prop-types";
import Chart from "./Chart";
import DataLoader from "../shared/DataLoader";
import getMonthlyConfig from "./charts/precipitationMonthly";
import getDailyConfig from "./charts/precipitationDaily";

const PrecipitationTab = ({
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

PrecipitationTab.propTypes = {
  name: PropTypes.string.isRequired,
  periodType: PropTypes.string.isRequired,
  referencePeriod: PropTypes.string.isRequired,
  monthlyPeriod: PropTypes.object,
  monthlyData: PropTypes.array,
  dailyData: PropTypes.array,
};

export default PrecipitationTab;
