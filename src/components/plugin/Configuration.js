import { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import DataSelect from "./DataSelect";
import OrgUnitTree from "../shared/OrgUnitTree";
import useOrgUnit from "../../hooks/useOrgUnit";
import styles from "./styles/Configuration.module.css";

const noGeometryWarning = i18n.t(
  "Selected org unit has no geometry, which is required to display data."
);

const onlyPointWarning = i18n.t(
  "Data is only available for facilities (point locations)."
);

const Configuration = (props) => {
  const [dataset, setDataset] = useState(null);
  const [orgUnit, setOrgUnit] = useState(null);
  const loadedOrgUnit = useOrgUnit(orgUnit?.id);
  const isLoaded = !!loadedOrgUnit;
  const hasGeometry = loadedOrgUnit?.geometry;
  const geometryType = loadedOrgUnit?.geometry?.type;

  // console.log("Configuration", dataset);

  // TODO: Select user org unit
  return (
    <div className={styles.content}>
      <h2>{i18n.t("Configuration")}</h2>
      <DataSelect value={dataset} onChange={setDataset} />
      {dataset && (
        <>
          <h3>{i18n.t("Organisation unit")}</h3>
          <div className={styles.orgUnitTree}>
            <OrgUnitTree
              orgUnit={orgUnit}
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
    </div>
  );
};

export default Configuration;
