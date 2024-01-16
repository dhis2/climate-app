import { useDataEngine } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

const ORG_UNIT_LEVELS_QUERY = {
  levels: {
    resource: "organisationUnitLevels",
    params: {
      fields: ["id", "displayName~rename(name)", "level"],
      order: "level:asc",
      paging: false,
    },
  },
};

const useOrgUnitLevels = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const engine = useDataEngine();

  useEffect(() => {
    engine.query(ORG_UNIT_LEVELS_QUERY, {
      onComplete: setData,
      onError: setError,
    });
  }, [engine]);

  return {
    levels: data?.levels?.organisationUnitLevels,
    error,
    loading: !data && !error,
  };
};

export default useOrgUnitLevels;
