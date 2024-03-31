import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import PropTypes from "prop-types";
import DataLoader from "../../shared/DataLoader";
import DayForecast from "./DayForecast.js";
import styles from "./styles/ForecastTab.module.css";

const convertTimezone = (date, timeZone = "Etc/UTC") =>
  new Date(date).toLocaleString("sv-SE", { timeZone }); // "sv-SE" follows ISO format

const ForecastTab = ({ geometry }) => {
  const [data, setData] = useState();

  const [lng, lat] = geometry.coordinates;
  // const [lng, lat] = [167.905556, -44.648056]; // Milford Sound, New Zealand 'Pacific/Auckland'
  // const [lng, lat] = [168.133333, -46.9]; // Oban, New Zealand 'Pacific/Auckland'

  useEffect(() => {
    fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lng}`
    )
      .then((response) => response.json())
      .then(setData);
  }, [lng, lat]);

  if (!data) {
    return <DataLoader height={400} />;
  }

  const timeZone = "Etc/UTC";
  // const timeZone = "Pacific/Auckland";

  const timeseries = data.properties.timeseries.map(({ time, data }) => ({
    time: convertTimezone(time, timeZone),
    data,
  }));

  const dates = timeseries.reduce((acc, { time }) => {
    const date = time.slice(0, 10);
    if (!acc.includes(date)) {
      acc.push(date);
    }
    return acc;
  }, []);

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <td></td>
            <td>{i18n.t("Night")}</td>
            <td>{i18n.t("Morning")}</td>
            <td>{i18n.t("Afternoon")}</td>
            <td>{i18n.t("Evening")}</td>
            <td className={styles.right}>{i18n.t("Max/min temp.")}</td>
            <td className={styles.right}>{i18n.t("Precip.")}</td>
            <td className={styles.right}>{i18n.t("Wind")}</td>
          </tr>
        </thead>
        <tbody>
          {dates.map((date) => (
            <DayForecast
              key={date}
              date={date}
              series={timeseries.filter((t) => t.time.startsWith(date))}
            />
          ))}
        </tbody>
      </table>
      <div className={styles.source}>
        Data from{" "}
        <a href="https://api.met.no" target="_blank" rel="noreferrer">
          MET Norway
        </a>{" "}
        /{" "}
        <a
          href="https://www.ecmwf.int/en/forecasts/datasets/set-i"
          target="_blank"
          rel="noreferrer"
        >
          ECMWF HRES
        </a>
      </div>
    </>
  );
};

ForecastTab.propTypes = {
  name: PropTypes.string.isRequired,
  geometry: PropTypes.object.isRequired,
};

export default ForecastTab;
