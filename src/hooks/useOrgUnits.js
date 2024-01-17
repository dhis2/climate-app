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

const parseOrgUnits = (data) =>
  data.geojson.features.map(({ type, id, geometry }) => ({
    type,
    id,
    properties: { id },
    geometry,
  }));

const useOrgUnits = (level) => {
  const [features, setFeatures] = useState();
  const [error, setError] = useState();
  const engine = useDataEngine();

  useEffect(() => {
    engine.query(ORG_UNITS_QUERY, {
      variables: { level },
      onComplete: (data) => setFeatures(parseOrgUnits(data)),
      onError: setError,
    });
  }, [engine]);

  return {
    features,
    error,
    loading: !features && !error,
  };
};

export default useOrgUnits;
