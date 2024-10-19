import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import Chart from "../../explore/Chart";
import getChartConfig from "../charts/AirQualityGauge";
import legend from "../../../data/pm2.5-legend";
import styles from "./styles/SiteMeasurements.module.css";

const token = "4ZFXXVHKFJYNAMYV"; // TODO: Change

const testData = {
  device: "airqo-g5139",
  device_id: "63e20c993d2d33001e5266b4",
  is_reading_primary: true,
  health_tips: [
    {
      _id: "64283ec79c7eaf001ea5e9c9",
      title: "For Everyone",
      description:
        "Avoid activities that make you breathe more rapidly. Today is the perfect day to spend indoors reading.",
      image:
        "https://firebasestorage.googleapis.com/v0/b/airqo-250220.appspot.com/o/health-tip-images%2Ffamily.png?alt=media&token=8cdc93c0-9f3f-42db-b9a1-7dbdf73c5519",
    },
  ],
  site_id: "6461df90dab86000293ba49f",
  time: "2024-10-19T08:00:00.000Z",
  pm2_5: {
    value: 57.4929,
  },
  pm10: {
    value: 85.1324089769792,
  },
  frequency: "hourly",
  no2: {},
  siteDetails: {
    _id: "6461df90dab86000293ba49f",
    formatted_name: "8H7V+JXC, Kampala, Uganda",
    parish: "Makindye Division",
    village: "Makindye Division",
    sub_county: "Makindye Division",
    town: "Kampala",
    city: "Kampala",
    district: "Kampala",
    county: "Kampala",
    region: "Central Region",
    country: "Uganda",
    name: "Mukwano  Road device 5",
    approximate_latitude: 0.310194643492371,
    approximate_longitude: 32.5972135856642,
    bearing_in_radians: 2.616,
    description: "Mukwano  Road device 5",
    location_name: "Kampala, Uganda",
    search_name: "Makindye Division",
    data_provider: "AirQo",
    lastActive: "2024-10-19T07:00:00.000Z",
    isOnline: true,
  },
  timeDifferenceHours: 1.29829083333333,
  aqi_color: "ff0000",
  aqi_category: "Unhealthy",
  aqi_color_name: "Red",
};

const SiteMeasurements = ({ siteId }) => {
  const [data, setData] = useState(testData);

  /*
  useEffect(() => {
    fetch(
      `https://api.airqo.net/api/v2/devices/measurements/sites/${siteId}/recent?token=${token}`
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
  }, []);
  */

  if (!data) {
    return <div>{i18n.t("Loading...")}</div>;
  }

  const {
    siteDetails: { name, city },
    aqi_category: category,
    aqi_color: color,
    health_tips,
    no2: { value: no2 },
    pm2_5: { value: pm2_5 },
    pm10: { value: pm10 },
    time,
  } = data;

  // console.log(name, city, category, color, health_tips, no2, pm2_5, pm10, time);

  const description = legend.items.find(
    (item) => item.category === category
  )?.description;

  console.log("time", new Date(time));

  return data ? (
    <div className={styles.container}>
      <Chart config={getChartConfig(name, pm2_5, category)} />
      {description && <div className={styles.description}>{description}</div>}
    </div>
  ) : null;
};

export default SiteMeasurements;
