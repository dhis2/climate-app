import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import OrgUnitLoader from "./OrgUnitLoader";
import Configuration from "./Configuration";
import usePluginConfig from "../../hooks/usePluginConfig";
import styles from "./styles/Plugin.module.css";

const Plugin = (props) => {
  const { dashboardItemId, setDashboardItemDetails, dashboardMode } = props;
  const [editMode, setEditMode] = useState();
  const { config, loading, setPluginConfig } = usePluginConfig(dashboardItemId);

  console.log("Climate Plugin props", props);

  useEffect(() => {
    if (config && setDashboardItemDetails) {
      setDashboardItemDetails({
        itemTitle: config.title,
        appUrl: config.url,
      });
    }
  }, [setDashboardItemDetails, config]);

  useEffect(() => {
    if (
      dashboardMode === "edit" &&
      !loading &&
      !config &&
      editMode === undefined
    ) {
      setEditMode(true);
    }
  }, [editMode, config, loading, dashboardMode]);

  if (editMode) {
    return (
      <Configuration
        config={config}
        onDone={(config) => {
          setPluginConfig(config);
          setEditMode(false);
        }}
      />
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {config ? (
        <OrgUnitLoader {...config} />
      ) : (
        <div>{i18n.t("Not configured")}</div>
      )}
      {dashboardMode === "edit" && (
        <div className={styles.editButton}>
          <Button onClick={() => setEditMode(true)}>{i18n.t("Edit")}</Button>
        </div>
      )}
    </div>
  );
};

export default Plugin;
