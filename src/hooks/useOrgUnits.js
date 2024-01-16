import { useDataEngine } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

const ORG_UNITS_QUERY = {
  geojson: {
    resource: "organisationUnits.geojson",
    params: ({ level }) => ({
      level,
    }),
  },
};

const useOrgUnits = (level) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const engine = useDataEngine();

  useEffect(() => {
    engine.query(ORG_UNITS_QUERY, {
      variables: { level },
      onComplete: setData,
      onError: setError,
    });
  }, [engine]);

  return {
    features: data?.geojson?.features,
    error,
    loading: !data && !error,
  };
};

export default useOrgUnits;
