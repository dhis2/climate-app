import Forecast from "../explore/forecast/Forecast";
import TemperatureMonthly from "../explore/temperature/plugin/TemperatureMonthly";
import TemperatureDaily from "../explore/temperature/plugin/TemperatureDaily";
import HeatDaily from "../explore/heat/plugin/HeatDaily";
import styles from "./styles/PluginContent.module.css";

const displays = {
  forecast10days: Forecast,
  "temperature/monthly": TemperatureMonthly,
  "temperature/daily": TemperatureDaily,
  "heat/daily": HeatDaily,
};

const PluginContent = (props) => {
  const { display } = props;

  const Display = displays[display];

  if (!Display) {
    return <div>Display not found (this should not happen)</div>;
  }

  console.log("PluginContent props", props);

  // {!setDashboardItemDetails && <div className={styles.title}>{title}</div>}
  return (
    <div className={styles.content}>
      <Display {...props} />
    </div>
  );
};

export default PluginContent;
