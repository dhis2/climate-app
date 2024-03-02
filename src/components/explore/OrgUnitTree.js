import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrganisationUnitTree } from "@dhis2/ui";
import useOrgUnitRoots from "../../hooks/useOrgUnitRoots";
import styles from "./styles/OrgUnitTree.module.css";

const OrgUnitTree = () => {
  const { state } = useLocation();
  const [orgUnit, setOrgUnit] = useState(state);
  const { roots } = useOrgUnitRoots();
  const navigate = useNavigate();

  const initiallyExpanded =
    orgUnit?.path && orgUnit.path.length > 12
      ? [orgUnit.path.slice(0, -12)]
      : roots?.map((r) => r.path);

  useEffect(() => {
    if (orgUnit) {
      navigate(`/explore/${orgUnit.id}`, { state: orgUnit });
    }
  }, [orgUnit, navigate]);

  return roots ? (
    <div className={styles.orgUnitTree}>
      <OrganisationUnitTree
        roots={roots.map((r) => r.id)}
        selected={orgUnit?.selected}
        onChange={setOrgUnit}
        singleSelection={true}
        initiallyExpanded={initiallyExpanded}
      />
    </div>
  ) : null;
};

export default OrgUnitTree;
