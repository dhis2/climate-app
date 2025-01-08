import { useState, useCallback, useEffect } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { createKeyInNamespace } from "../utils/dataStore";

const APP_NAMESPACE = "CLIMATE_DATA";
const PLUGINS_KEY = "plugins";

const resource = `dataStore/${APP_NAMESPACE}/${PLUGINS_KEY}`;

// TODO: Only load one plugin config at a time
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
                createKeyInNamespace(engine, resource)
                  .then(() => setLoading(false))
                  .catch(setError);
              }
            });
        } else {
          createKeyInNamespace(engine, resource)
            .then(() => setLoading(false))
            .catch(setError);
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

  const clearPluginConfig = useCallback(
    () =>
      new Promise((resolve, reject) => {
        const { [pluginId]: removedPlugin, ...remainingPlugins } = plugins;

        engine
          .mutate({
            resource,
            type: "update",
            data: remainingPlugins,
          })
          .then((response) => {
            if (response.httpStatusCode === 200) {
              getPlugins();
              resolve(response);
            } else {
              setError(response);
              reject(response);
            }
          })
          .catch((error) => {
            setError(error);
            reject(error);
          });
      }),
    [engine, pluginId, plugins, getPlugins]
  );

  useEffect(() => {
    getPlugins();
  }, [engine, getPlugins]);

  return {
    config,
    loading: !config && loading,
    error,
    setPluginConfig,
    clearPluginConfig,
  };
};

export default usePluginConfig;
