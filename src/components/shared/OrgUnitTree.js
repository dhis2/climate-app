import PropTypes from "prop-types";
import { useEffect } from "react";
import { OrganisationUnitTree } from "@dhis2/ui";
import useOrgUnitRoots from "../../hooks/useOrgUnitRoots";

const OrgUnitTree = ({ orgUnit, rootIsDefault = true, onChange }) => {
  const { roots, error } = useOrgUnitRoots();

  // Set for root node as default
  useEffect(() => {
    if (rootIsDefault && roots && !orgUnit) {
      const [root] = roots;
      onChange({ ...root, selected: [root.path] });
    }
  }, [rootIsDefault, roots, orgUnit, onChange]);

  // The warnings "The query should be static, don't create it within the render loop!"
  // comes from the OrganisationUnitTree component:
  // https://dhis2.slack.com/archives/C0BP0RABF/p1641544953003000x
  return roots ? (
    <OrganisationUnitTree
      roots={roots.map((r) => r.id)}
      selected={orgUnit?.selected}
      onChange={onChange}
      singleSelection={true}
      initiallyExpanded={roots.map((r) => r.path)}
    />
  ) : error ? (
    <div>{error.message}</div>
  ) : null;
};

OrgUnitTree.propTypes = {
  orgUnit: PropTypes.object,
  rootIsDefault: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default OrgUnitTree;
