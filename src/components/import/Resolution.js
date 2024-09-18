import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import styles from "./styles/Resolution.module.css";

const Resolution = ({ resolution }) => (
  <div className={styles.container}>
    <div>
      {i18n.t("Data resolution")}: <strong>{resolution}</strong>
    </div>
    <p>
      {i18n.t(
        "Please note: You can import data for the lowest levels in your org unit hierarchy, but it won't improve the resolution of the data. If two org units are close to each other (within the resolution), they will have the same data values."
      )}
    </p>
  </div>
);

Resolution.propTypes = {
  resolution: PropTypes.string.isRequired,
};

export default Resolution;
