import i18n from "@dhis2/d2-i18n";
import Inputs from "./Inputs";
import styles from "../styles/Page.module.css";

const Page = () => {
  return (
    <div className={styles.container}>
      <h1>{i18n.t("Import weather and climate data")}</h1>
      <Inputs />
    </div>
  );
};

export default Page;
