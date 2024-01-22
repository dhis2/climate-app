import i18n from "@dhis2/d2-i18n";
import styles from "./styles/Page.module.css";

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1>{i18n.t("About this app")}</h1>
      <p>...</p>
    </div>
  );
};

export default AboutPage;
