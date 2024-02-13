import i18n from "@dhis2/d2-i18n";
import OrgUnitTree from "./OrgUnitTree";
import OrgUnitLevel from "./OrgUnitLevel";
import classes from "./styles/OrgUnits.module.css";

const OrgUnits = ({ selected = {}, onChange }) => {
  const { parent, level } = selected;

  const parentIsBelowLevel =
    parent && level && parent.path.split("/").length - 1 > Number(level);

  return (
    <>
      <OrgUnitTree
        orgUnit={parent}
        onChange={(parent) => onChange({ parent, level })}
      />
      {parentIsBelowLevel === true && (
        <div className={classes.warning}>
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

export default OrgUnits;
