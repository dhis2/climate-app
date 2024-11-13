import { useEffect, useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import DataSelect from "./DataSelect";
import OrgUnitTree from "../shared/OrgUnitTree";
import useOrgUnit from "../../hooks/useOrgUnit";
import { datasets } from "./DataSelect";
import styles from "./styles/Configuration.module.css";

const noGeometryWarning = i18n.t(
  "Selected org unit has no geometry, which is required to display data."
);

const onlyPointWarning = i18n.t(
  "Data is only available for facilities (point locations)."
);

const getPluginConfig = (datasetId, orgUnit) => {
  const { id: orgUnitId, displayName } = orgUnit;

  if (datasetId === "forecast10days") {
    return {
      id: `${orgUnitId}/forecast10days`,
      url: `#/explore/${orgUnitId}/forecast10days`,
      title: `${displayName}: ${i18n.t("Weather forecast")}`,
      display: "forecast10days",
      orgUnitId,
    };
  }
};

const Configuration = ({ config, onDone }) => {
  const [datasetId, setDatasetId] = useState();
  const [orgUnit, setOrgUnit] = useState(null);
  const loadedOrgUnit = useOrgUnit(orgUnit?.id || config?.orgUnitId);
  const dataset = datasets.find((d) => d.id === datasetId);
  const isLoaded = !!loadedOrgUnit;
  const hasGeometry = loadedOrgUnit?.geometry;
  const geometryType = loadedOrgUnit?.geometry?.type;
  const isValid =
    dataset &&
    orgUnit &&
    isLoaded &&
    hasGeometry &&
    (dataset.geometryType ? geometryType === dataset.geometryType : true);

  const onDoneClick = () => onDone(getPluginConfig(datasetId, orgUnit));

  useEffect(() => {
    if (config) {
      setDatasetId(config.display);
    }
  }, [config]);

  // TODO: Select user org unit
  return (
    <div className={styles.content}>
      <h2>{i18n.t("Configuration")}</h2>
      <DataSelect value={datasetId} onChange={setDatasetId} />
      {datasetId && loadedOrgUnit && (
        <>
          <h3>{i18n.t("Select organisation unit")}</h3>
          <div className={styles.orgUnitTree}>
            <OrgUnitTree
              orgUnit={loadedOrgUnit}
              rootIsDefault={false}
              onChange={setOrgUnit}
            />
          </div>
          {isLoaded && !hasGeometry && (
            <div className={styles.validation}>{noGeometryWarning}</div>
          )}
          {dataset.geometryType &&
            geometryType &&
            geometryType !== dataset.geometryType && (
              <div className={styles.validation}>{onlyPointWarning}</div>
            )}
        </>
      )}
      <Button
        className={styles.doneButton}
        disabled={!isValid}
        onClick={onDoneClick}
      >
        {i18n.t("Done")}
      </Button>
    </div>
  );
};

export default Configuration;
