import Chart from "./Chart";
import getMonthlyConfig from "./charts/precipitationMonthly";
import getDailyConfig from "./charts/precipitationDaily";

const PrecipitationTab = ({ periodType, monthlyData, dailyData }) => (
  <>
    {periodType === "monthly" ? (
      <Chart config={getMonthlyConfig(monthlyData)} />
    ) : (
      <Chart config={getDailyConfig(dailyData)} />
    )}
  </>
);

export default PrecipitationTab;
