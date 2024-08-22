import ForecastTab from "../explore/forecast/ForecastTab";
import styles from "./styles/Plugin.module.css";

const orgUnit = {
  id: "finse",
  path: "/world/norway/finse",
  displayName: "Finse",
  children: [],
  geometry: {
    type: "Point",
    coordinates: [7.502289, 60.602791],
  },
  properties: {
    name: "Finse",
  },
};

const Plugin = (props) => {
  // const { dashboardItemId } = props;
  console.log("Plugin props", props);
  return (
    <div className={styles.plugin}>
      <div className={styles.title}>
        {orgUnit.properties.name}: 10 days weather forecast
      </div>
      <ForecastTab orgUnit={orgUnit} isPlugin={true} />
    </div>
  );
};

export default Plugin;
