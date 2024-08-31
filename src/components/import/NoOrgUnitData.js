import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import styles from "./styles/NoOrgUnitData.module.css";

const NoOrgUnitData = ({ data, features }) => {
  const orgUnits = features
    .filter((f) =>
      data.filter((d) => d.ou === f.id).every((d) => isNaN(d.value))
    )
    .map((f) => f.properties.name);

  return orgUnits.length ? (
    <div className={styles.noData}>
      {i18n.t("No data for the following org units")}: {orgUnits.join(", ")}
      <br />
      {/* {i18n.t(
        "ERA5-Land has limited data for costal areas. Values for other org units will be imported."
      )} */}
    </div>
  ) : null;
};

NoOrgUnitData.propTypes = {
  data: PropTypes.array.isRequired,
  features: PropTypes.array.isRequired,
};

export default NoOrgUnitData;
