import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

export const ORG_UNITS_QUERY = {
  geojson: {
    resource: "organisationUnits.geojson",
    params: ({ parent, level }) => ({
      parent,
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

const useOrgUnits = (parent, level) => {
  const [features, setFeatures] = useState();

  const { loading, error } = useDataQuery(ORG_UNITS_QUERY, {
    variables: { parent, level },
    onComplete: (data) => setFeatures(parseOrgUnits(data)),
  });

  return {
    features,
    error,
    loading,
  };
};

export default useOrgUnits;
