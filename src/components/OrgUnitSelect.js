import { OrgUnitDimension } from "@dhis2/analytics";
import i18n from "@dhis2/d2-i18n";
import { Divider } from "@dhis2/ui";
import useOrgUnitRoots from "../hooks/useOrgUnitRoots";

const OrgUnitSelect = ({ orgUnits, onChange }) => {
  const { roots /*, error, loading */ } = useOrgUnitRoots();

  return roots ? (
    <div>
      <h2>{i18n.t("Organisation units")}</h2>
      <Divider />
      <p>{i18n.t("Organisation unit(s) to import data to")}</p>
      <OrgUnitDimension
        roots={roots.map((r) => r.id)}
        selected={orgUnits}
        onSelect={(ou) => onChange(ou.items)}
        hideUserOrgUnits={true}
        hideGroupSelect={true}
        // warning={!hasOrgUnits ? warning : null}
      />
    </div>
  ) : null;
};

export default OrgUnitSelect;
