import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";
import OrgUnit from "../explore/OrgUnit";
import { findLocation } from "../../data/locations";
import styles from "../explore/styles/ExplorePage.module.css";

const CheckPage = () => {
  const { state } = useLocation();
  const locationId = state?.id;

  const orgUnit = useMemo(() => {
    if (!locationId) {
      return null;
    }
    const location = findLocation(locationId);

    return {
      ...location,
      properties: {
        name: location.displayName,
      },
    };
  }, [locationId]);

  return (
    <div className={styles.container}>
      {orgUnit ? (
        <OrgUnit {...state} orgUnit={orgUnit} />
      ) : (
        <div className={styles.introduction}>
          <h1>{i18n.t("Check weather and climate data")}</h1>
          <p>{i18n.t("Select a location in the left panel")}</p>
        </div>
      )}
    </div>
  );
};

export default CheckPage;
