import { useState } from "react";
import PropTypes from "prop-types";
import MonthSelect from "./MonthSelect";
import Chart from "./Chart";
import getChartConfig from "./charts/temperatureAnomaly";
import styles from "./styles/TabContent.module.css";

const ClimateChangeTab = ({ name, monthlyData, referencePeriod }) => {
  const [month, setMonth] = useState(
    monthlyData.slice(-1)[0].id.substring(5, 7) // Last month available
  );

  return (
    <>
      <Chart
        config={getChartConfig(name, monthlyData, month, referencePeriod)}
      />
      <div className={styles.monthSelect}>
        <MonthSelect selected={month} onChange={setMonth} />
      </div>
    </>
  );
};

ClimateChangeTab.propTypes = {
  name: PropTypes.string.isRequired,
  monthlyData: PropTypes.array.isRequired,
  referencePeriod: PropTypes.string.isRequired,
};

export default ClimateChangeTab;
