import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrganisationUnitTree } from "@dhis2/ui";
import useOrgUnitRoots from "../../hooks/useOrgUnitRoots";
import styles from "./styles/OrgUnitTree.module.css";

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
    <div className={styles.orgUnitTree}>
      <OrganisationUnitTree
        roots={roots.map((r) => r.id)}
        selected={orgUnit?.selected}
        onChange={setOrgUnit}
        singleSelection={true}
        initiallyExpanded={roots.map((r) => r.path)}
      />
    </div>
  ) : null;
};

export default OrgUnitTree;
