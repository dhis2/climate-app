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
  const { config, loading, setPluginConfig, clearPluginConfig } =
    usePluginConfig(dashboardItemId);

  useEffect(() => {
    if (config && setDashboardItemDetails) {
      setDashboardItemDetails({
        itemTitle: config.title,
        appUrl: config.url,
        onRemove: clearPluginConfig,
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
      <div className={styles.container}>
        <Configuration
          config={config}
          onDone={(config) => {
            setPluginConfig(config);
            setEditMode(false);
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>{i18n.t("Loading")}...</div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {config ? (
          <OrgUnitLoader {...config} />
        ) : (
          <div className={styles.message}>
            {i18n.t(
              "No data source. Edit this dashboard to configure this item."
            )}
          </div>
        )}
      </div>
      {dashboardMode === "edit" && (
        <div className={styles.editButton}>
          <Button onClick={() => setEditMode(true)}>
            {i18n.t("Configure data source")}
          </Button>
        </div>
      )}
    </>
  );
};

export default Plugin;
