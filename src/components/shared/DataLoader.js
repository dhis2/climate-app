import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import styles from "./styles/DataLoader.module.css";

const DataLoader = ({ label, height }) => (
  <div className={styles.container} style={{ height }}>
    <CenteredContent>
      <div className={styles.loader}>
        <CircularLoader small />
        {label ? label : i18n.t("Loading data")}
      </div>
    </CenteredContent>
  </div>
);

DataLoader.propTypes = {
  label: PropTypes.string,
};

export default DataLoader;
