import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrganisationUnitTree } from "@dhis2/ui";
import useOrgUnitRoots from "../../hooks/useOrgUnitRoots";

const OrgUnitTree = () => {
  const [orgUnit, setOrgUnit] = useState();
  const { roots /*, error, loading */ } = useOrgUnitRoots();
  const navigate = useNavigate();

  useEffect(() => {
    if (orgUnit) {
      const { id, displayName } = orgUnit;
      navigate(`/explore/${id}`, { state: { id, name: displayName } });
    }
  }, [orgUnit, navigate]);

  return roots ? (
    <OrganisationUnitTree
      roots={roots.map((r) => r.id)}
      selected={orgUnit?.selected}
      onChange={setOrgUnit}
      singleSelection={true}
      initiallyExpanded={roots.map((r) => r.path)}
    />
  ) : null;
};

export default OrgUnitTree;
