import Forecast from "../explore/forecast/Forecast";
import TemperatureMonthly from "../explore/temperature/plugin/TemperatureMonthly";
import TemperatureDaily from "../explore/temperature/TemperatureDaily";
import styles from "./styles/PluginContent.module.css";

const displays = {
  forecast10days: Forecast,
  "temperature/monthly": TemperatureMonthly,
  "temperature/daily": TemperatureDaily,
};

const PluginContent = (props) => {
  const { display, title } = props;

  const Display = displays[display];

  if (!Display) {
    return <div>Display not found (this should not happen)</div>;
  }

  return (
    <div className={styles.content}>
      <div className={styles.title}>{title}</div>
      <Display {...props} />
    </div>
  );
};

export default PluginContent;
