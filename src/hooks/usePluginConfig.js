import { useState, useCallback, useEffect } from "react";
import { useDataEngine } from "@dhis2/app-runtime";

const APP_NAMESPACE = "CLIMATE_DATA";
const PLUGINS_KEY = "plugins";

const resource = `dataStore/${APP_NAMESPACE}/${PLUGINS_KEY}`;

// TODO: Only load one plugin config
// TODO: Delete plugin config
const usePluginConfig = (pluginId) => {
  const [loading, setLoading] = useState(true);
  const [plugins, setPlugins] = useState();
  const [error, setError] = useState();
  const engine = useDataEngine();

  const config = plugins?.[pluginId];

  // Fetch plugin configs / create namspace/key if missing
  const getPlugins = useCallback(() => {
    setLoading(true);
    engine
      .query({ dataStore: { resource: "dataStore" } })
      .then(({ dataStore }) => {
        const createNamespaceKey = () =>
          engine
            .mutate({
              resource,
              type: "create",
              data: {},
            })
            .then((response) => {
              if (response.httpStatusCode === 201) {
                setLoading(false);
              } else {
                setError(response);
              }
            })
            .catch(setError);

        if (dataStore.includes(APP_NAMESPACE)) {
          // Fetch plugin configs if namespace/keys exists in data store
          engine
            .query({ plugins: { resource } })
            .then(({ plugins }) => {
              setPlugins(plugins);
              setLoading(false);
            })
            .catch((error) => {
              if (error.message.includes("(404)")) {
                // key not found
                createNamespaceKey();
              }
            });
        } else {
          createNamespaceKey();
        }
      });
  }, [engine]);

  const setPluginConfig = useCallback(
    (config) => {
      engine
        .mutate({
          resource,
          type: "update",
          data: {
            ...plugins,
            [pluginId]: config,
          },
        })
        .then((response) => {
          if (response.httpStatusCode === 200) {
            getPlugins();
          } else {
            setError(response);
          }
        })
        .catch(setError);
    },
    [engine, pluginId, plugins, getPlugins]
  );

  useEffect(() => {
    getPlugins();
  }, [engine, getPlugins]);

  return { config, loading: !config && loading, error, setPluginConfig };
};

export default usePluginConfig;
