import i18n from "@dhis2/d2-i18n";
import { useEffect } from "react";
import { OrganisationUnitTree } from "@dhis2/ui";
import useOrgUnitRoots from "../../hooks/useOrgUnitRoots";

const OrgUnitTree = ({ orgUnit, onChange }) => {
  const { roots } = useOrgUnitRoots();

  // Set for root node as default
  useEffect(() => {
    if (roots && !orgUnit) {
      const [root] = roots;
      onChange({ ...root, selected: [root.path] });
    }
  }, [roots, orgUnit, onChange]);

  return roots ? (
    <div>
      <h2>{i18n.t("Parent organisation unit")}</h2>
      <OrganisationUnitTree
        roots={roots.map((r) => r.id)}
        selected={orgUnit?.selected}
        onChange={onChange}
        singleSelection={true}
        initiallyExpanded={roots.map((r) => r.path)}
      />
    </div>
  ) : null;
};

export default OrgUnitTree;
