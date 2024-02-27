import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { CircularLoader } from "@dhis2/ui";
import styles from "./styles/DataLoader.module.css";

const DataLoader = ({ label }) => (
  <div className={styles.container}>
    <CircularLoader small />
    {label ? label : i18n.t("Loading data")}
  </div>
);

DataLoader.propTypes = {
  label: PropTypes.string,
};

export default DataLoader;
