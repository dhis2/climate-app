import Forecast from "../explore/forecast/Forecast";
import TemperatureMonthly from "../explore/temperature/plugin/TemperatureMonthly";
import TemperatureDaily from "../explore/temperature/plugin/TemperatureDaily";
import styles from "./styles/PluginContent.module.css";

const displays = {
  forecast10days: Forecast,
  "temperature/monthly": TemperatureMonthly,
  "temperature/daily": TemperatureDaily,
};

const PluginContent = (props) => {
  const { display, title, setDashboardItemDetails } = props;

  const Display = displays[display];

  if (!Display) {
    return <div>Display not found (this should not happen)</div>;
  }

  console.log("PluginContent props", props);

  return (
    <div className={styles.content}>
      {!setDashboardItemDetails && <div className={styles.title}>{title}</div>}
      <Display {...props} />
    </div>
  );
};

export default PluginContent;
