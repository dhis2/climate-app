import i18n from "@dhis2/d2-i18n";
import { useLocation } from "react-router-dom";
import OrgUnit from "./OrgUnit";
import useOrgUnit from "../../hooks/useOrgUnit";
import styles from "../styles/Page.module.css";

const ExplorePage = () => {
  const { state } = useLocation();
  const orgUnit = useOrgUnit(state?.id);

  return (
    <div className={styles.container}>
      {state ? (
        <>
          {orgUnit ? (
            <OrgUnit {...state} orgUnit={orgUnit} />
          ) : (
            <p>{i18n.t("Loading")}...</p>
          )}
        </>
      ) : (
        <h1>{i18n.t("Select an organisation unit")}</h1>
      )}
    </div>
  );
};

export default ExplorePage;
