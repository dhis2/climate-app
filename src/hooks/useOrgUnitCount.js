import { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { ORG_UNITS_QUERY } from "./useOrgUnits";

const useOrgUnitCount = (parent, level) => {
  const [orgUnitCount, setOrgUnitCount] = useState(0);

  const { refetch } = useDataQuery(ORG_UNITS_QUERY, {
    lazy: true,
    variables: { parent, level },
    onComplete: ({ geojson }) => setOrgUnitCount(geojson.features.length),
  });

  useEffect(() => {
    if (parent && level) {
      refetch({ parent, level });
    }
  }, [refetch, parent, level]);

  return orgUnitCount;
};

export default useOrgUnitCount;
