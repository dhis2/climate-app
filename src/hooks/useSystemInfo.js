import { useDataEngine } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

// TODO: Check if user has necessary authorities
const SYSTEM_QUERY = {
  currentUser: {
    resource: "me",
    params: {
      fields:
        "id,username,displayName~rename(name),authorities,settings[keyAnalysisDisplayProperty]",
    },
  },
  systemInfo: {
    resource: "system/info",
    params: {
      fields: "serverTimeZoneId",
    },
  },
};

const useSystemInfo = () => {
  const [system, setSystem] = useState();
  const [error, setError] = useState();
  const engine = useDataEngine();

  useEffect(() => {
    console.log("querying system info");
    engine.query(SYSTEM_QUERY, {
      onComplete: setSystem,
      onError: setError,
    });
  }, [engine]);

  return {
    system,
    error,
    loading: !system && !error,
  };
};

export default useSystemInfo;
