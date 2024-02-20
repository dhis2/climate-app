import { useDataQuery } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

const ORG_UNIT_QUERY = {
  ou: {
    resource: "organisationUnits",
    id: ({ id }) => id,
  },
};

const useOrgUnit = (id) => {
  const [orgUnit, setOrgUnit] = useState();

  const { refetch } = useDataQuery(ORG_UNIT_QUERY, {
    lazy: true,
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

  useEffect(() => {
    if (id) {
      setOrgUnit();
      refetch({ id });
    }
  }, [refetch, id]);

  return orgUnit;
};

export default useOrgUnit;
