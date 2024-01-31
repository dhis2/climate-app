import Chart from "./Chart";
import getMonthlyConfig from "./charts/temperatureMonthly";
import getDailyConfig from "./charts/temperatureDaily";

const TemperatureTab = ({ periodType, monthlyData, dailyData }) => (
  <>
    {periodType === "monthly" ? (
      <Chart config={getMonthlyConfig(monthlyData)} />
    ) : (
      <Chart config={getDailyConfig(dailyData)} />
    )}
  </>
);

export default TemperatureTab;
