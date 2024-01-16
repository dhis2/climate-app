import { useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Layer, CenteredContent, CircularLoader, NoticeBox } from "@dhis2/ui";
import PropTypes from "prop-types";
import React, { createContext, useContext, useState, useEffect } from "react";

// A similar version of this provider is available in @dhis2/analytics@^23

const CachedDataQueryCtx = createContext({});

const NO_DATA = {};

const CachedDataQueryProvider = ({ query, dataTransformation, children }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const engine = useDataEngine();

  useEffect(() => {
    engine.query(query, {
      onComplete: (resp) => {
        const dt = resp ? dataTransformation(resp) : NO_DATA;
        setData(dt);
      },
      onError: (error) => {
        console.log(
          "Error",
          "The app could not retrieve required data.",
          error
        );
        setError(error);
        setData(NO_DATA);
      },
    });
  }, [engine, dataTransformation, query]);

  if (!data && !error) {
    return (
      <Layer translucent>
        <CenteredContent>
          <CircularLoader />
        </CenteredContent>
      </Layer>
    );
  }

  if (error) {
    const fallbackMsg = i18n.t("The app could not retrieve required data.");

    return (
      <NoticeBox error title={i18n.t("Network error")}>
        {error.message || fallbackMsg}
      </NoticeBox>
    );
  }

  return (
    <CachedDataQueryCtx.Provider value={data}>
      {children}
    </CachedDataQueryCtx.Provider>
  );
};

CachedDataQueryProvider.propTypes = {
  children: PropTypes.node.isRequired,
  query: PropTypes.object.isRequired,
  dataTransformation: PropTypes.func,
};

const useCachedDataQuery = () => useContext(CachedDataQueryCtx);

export { CachedDataQueryProvider, useCachedDataQuery };
