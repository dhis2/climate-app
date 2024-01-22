import i18n from "@dhis2/d2-i18n";
import { useLocation } from "react-router-dom";
import OrgUnit from "./OrgUnit";
import styles from "../styles/Page.module.css";

const ExplorePage = () => {
  const { state } = useLocation();

  return (
    <div className={styles.container}>
      {state ? (
        <OrgUnit {...state} />
      ) : (
        <h1>{i18n.t("Select an organisation unit")}</h1>
      )}
    </div>
  );
};

export default ExplorePage;
