import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import OrgUnitTree from "../shared/OrgUnitTree";
import OrgUnitLevel from "./OrgUnitLevel";
import styles from "./styles/OrgUnits.module.css";

const OrgUnits = ({ selected = {}, onChange }) => {
  const { parent, level } = selected;

  const parentIsBelowLevel =
    parent && level && parent.path.split("/").length - 1 > Number(level);

  return (
    <>
      <h2>{i18n.t("Parent organisation unit")}</h2>
      <OrgUnitTree
        orgUnit={parent}
        onChange={(parent) => onChange({ parent, level })}
      />
      {parentIsBelowLevel === true && (
        <div className={styles.warning}>
          {i18n.t(
            "Org unit parent needs to be above or equal to the org unit level"
          )}
        </div>
      )}
      <OrgUnitLevel
        level={level}
        onChange={(level) => onChange({ parent, level })}
      />
    </>
  );
};

OrgUnits.propTypes = {
  selected: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default OrgUnits;
