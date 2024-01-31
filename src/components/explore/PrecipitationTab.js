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

export default PrecipitationTab;
