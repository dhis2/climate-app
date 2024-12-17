import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import Chart from "../../explore/Chart";
import getChartConfig from "../charts/AirQualityGauge";
import legend from "../../../data/pm2.5-legend";
import useAppSettings from "../../../hooks/useAppSettings";
import styles from "./styles/AirQoPlugin.module.css";

const AirQoPlugin = ({ siteId }) => {
  const [data, setData] = useState();
  const { settings = {} } = useAppSettings();
  const { airqoToken } = settings;

  useEffect(() => {
    if (airqoToken && !data) {
      fetch(
        `https://api.airqo.net/api/v2/devices/measurements/sites/${siteId}/recent?token=${airqoToken}`
      )
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setData(data?.measurements?.[0]);
            });
          } else {
            console.error(
              "Error fetching data:",
              response.status,
              response.statusText
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [airqoToken, data]);

  if (!airqoToken) {
    return <div>{i18n.t("AirQo token not set")}</div>;
  }

  if (!data) {
    return <div>{i18n.t("Loading...")}</div>;
  }

  const {
    siteDetails: { name, city },
    aqi_category: category,
    pm2_5: { value: pm2_5 },
    pm10: { value: pm10 },
    time,
  } = data;

  const description = legend.items.find(
    (item) => item.category === category
  )?.description;

  const formattedTime = new Date(time).toLocaleTimeString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return data ? (
    <div className={styles.container}>
      <Chart
        config={getChartConfig(
          `${name}, ${city}`,
          pm2_5,
          category,
          formattedTime
        )}
      />
      {description && <div className={styles.description}>{description}</div>}
    </div>
  ) : null;
};

export default AirQoPlugin;
