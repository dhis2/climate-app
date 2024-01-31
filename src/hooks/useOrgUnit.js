import { useDataEngine } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

const ORG_UNIT_QUERY = {
  ou: {
    resource: "organisationUnits",
    id: ({ id }) => id,
  },
};

const useOrgUnit = (id) => {
  const [orgUnit, setOrgUnit] = useState();
  const engine = useDataEngine();

  useEffect(() => {
    if (id) {
      setOrgUnit();

      engine.query(ORG_UNIT_QUERY, {
        variables: { id },
        onComplete: ({ ou }) =>
          setOrgUnit({
            type: "Feature",
            id: ou.id,
            geometry: ou.geometry,
            properties: {
              name: ou.displayName,
            },
          }),
      });
    }
  }, [engine, id]);

  return orgUnit;
};

export default useOrgUnit;
