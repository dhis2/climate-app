import { useState } from "react";
import Plugin from "./Plugin";
import styles from "./styles/PluginPage.module.css";

const PluginPage = () => {
  const [details, setDetails] = useState(null);

  return (
    <div className={styles.pluginPage}>
      <h1>Plugin</h1>
      <div className={styles.dashboard}>
        <div className={styles.dashboardItem}>
          <div className={styles.dashboardItemHeader}>
            <p>{details ? details.itemTitle : "Climate Data"}</p>
          </div>
          <div className={styles.dashboardItemContent}>
            <div className={styles.plugin}>
              <Plugin
                dashboardItemId="tf116s7c3YO"
                dashboardMode="edit"
                setDashboardItemDetails={setDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginPage;