import Plugin from "./Plugin";
import styles from "./styles/PluginPage.module.css";

const PluginPage = () => (
  <div>
    <h1>Plugin</h1>
    <div className={styles.plugin}>
      <Plugin dashboardItemId="tf116s7c3YO" />
    </div>
  </div>
);

export default PluginPage;
