import { useState, useCallback, useEffect } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { createKeyInNamespace } from "../utils/dataStore";

const APP_NAMESPACE = "CLIMATE_DATA";
const SETTINGS_KEY = "settings";

const resource = `dataStore/${APP_NAMESPACE}/${SETTINGS_KEY}`;

const useAppSettings = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState();
  const [error, setError] = useState();
  const engine = useDataEngine();

  // Fetch app settings / create namspace/key if missing
  const getSettings = useCallback(() => {
    setLoading(true);
    engine
      .query({ dataStore: { resource: "dataStore" } })
      .then(({ dataStore }) => {
        if (dataStore.includes(APP_NAMESPACE)) {
          // Fetch settings if namespace/keys exists in data store
          engine
            .query({ settings: { resource } })
            .then(({ settings }) => {
              setSettings(settings);
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
          // Create namespace/keys if missing in data store
          createKeyInNamespace(engine, resource)
            .then(() => setLoading(false))
            .catch(setError);
        }
      });
  }, [engine]);

  const changeSetting = useCallback(
    (setting, value) => {
      engine
        .mutate({
          resource,
          type: "update",
          data: {
            ...settings,
            [setting]: value,
          },
        })
        .then((response) => {
          if (response.httpStatusCode === 200) {
            getSettings();
          } else {
            setError(response);
          }
        })
        .catch(setError);
    },
    [engine, settings, getSettings]
  );

  useEffect(() => {
    getSettings();
  }, [engine, getSettings]);

  return { settings, loading, error, changeSetting };
};

export default useAppSettings;
