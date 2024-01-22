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
  const [error, setError] = useState();
  const engine = useDataEngine();

  useEffect(() => {
    setOrgUnit(undefined);
    setError(undefined);

    engine.query(ORG_UNIT_QUERY, {
      variables: { id },
      onComplete: ({ ou }) =>
        setOrgUnit([
          {
            type: "Feature",
            id: ou.id,
            geometry: ou.geometry,
            properties: {
              name: ou.displayName,
            },
          },
        ]),
      onError: setError,
    });
  }, [engine, id]);

  return {
    orgUnit,
    error,
    loading: !orgUnit && !error,
  };
};

export default useOrgUnit;
