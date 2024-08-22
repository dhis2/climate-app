import { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import PropTypes from "prop-types";
import DataLoader from "../../shared/DataLoader.js";
import DayForecast from "./DayForecast.js";
import useAppSettings from "../../../hooks/useAppSettings.js";
import styles from "./styles/ForecastTab.module.css";

const convertTimezone = (date, timeZone) =>
  new Date(date).toLocaleString("sv-SE", { timeZone }); // "sv-SE" follows ISO format

const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const Forecast = ({ orgUnit }) => {
  const [data, setData] = useState();
  const { settings, loading } = useAppSettings();

  const [lng, lat] = orgUnit.geometry.coordinates;

  useEffect(() => {
    fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lng}`
    )
      .then((response) => response.json())
      .then(setData);
  }, [lng, lat]);

  if (!data || loading) {
    return <DataLoader />;
  }

  const timeZone = settings?.timeZone || browserTimeZone || "Etc/UTC";

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
            <td className={styles.right}>{i18n.t("Rel. humidity")}</td>
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
      <div className={styles.timeZone}>
        {settings.timeZone
          ? i18n.t(
              'The forecast is using the "{{- timeZone}}" time zone. You can change the time zone for your org units under "Settings".',
              { timeZone }
            )
          : browserTimeZone
          ? i18n.t(
              'The forecast is using the time zone of your browser ({{- timeZone}}). You can set the time zone for your org units under "Settings".',
              { timeZone }
            )
          : i18n.t(
              'The forecast is using the default "{{- timeZone}}" time zone. You can set the time zone for your org units under "Settings".',
              { timeZone }
            )}
      </div>
    </>
  );
};

Forecast.propTypes = {
  name: PropTypes.string.isRequired,
  orgUnit: PropTypes.object.isRequired,
};

export default Forecast;
