import i18n from "@dhis2/d2-i18n";
import styles from "../explore/styles/ExplorePage.module.css";

const CheckPage = () => {
  return (
    <div className={styles.container}>
      <h1>{i18n.t("Check weather and climate data")}</h1>
      <p>{i18n.t("Select a location in the left panel")}</p>
    </div>
  );
};

export default CheckPage;
