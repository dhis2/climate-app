import { useState } from "react";
import MonthSelect from "./MonthSelect";
import Chart from "./Chart";
import getChartConfig from "./charts/temperatureAnomaly";
import classes from "./styles/TabContent.module.css";

const ClimateChangeTab = ({ monthlyData }) => {
  const [month, setMonth] = useState(
    monthlyData.slice(-1)[0].id.substring(5, 7) // Last month available
  );

  return (
    <>
      <div className={classes.monthSelect}>
        <MonthSelect selected={month} onChange={setMonth} />
      </div>
      <Chart config={getChartConfig(monthlyData, month)} />
    </>
  );
};

export default ClimateChangeTab;
