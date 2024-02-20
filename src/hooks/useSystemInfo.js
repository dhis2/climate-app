import { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

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
  const { loading, error, data } = useDataQuery(SYSTEM_QUERY);

  return {
    system: data,
    error,
    loading,
  };
};

export default useSystemInfo;
