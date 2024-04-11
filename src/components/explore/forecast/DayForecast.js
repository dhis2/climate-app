import PropTypes from "prop-types";
import React from "react";
import i18n from "@dhis2/d2-i18n";
import styles from "./styles/DayForecast.module.css";
import TemperatureValue from "./TemperatureValue.js";
import WeatherSymbol from "./WeatherSymbol.js";
import { roundOneDecimal } from "../../../utils/calc";

const sixHours = [
  { start: "00", end: "06" },
  { start: "06", end: "12" },
  { start: "12", end: "18" },
  { start: "18", end: "24" },
];

const DayForecast = ({ date, series }) => {
  const day = new Date(date).toDateString().slice(0, -5);
  const temp = series.map((s) => s.data.instant.details.air_temperature);
  const minTemp = Math.round(Math.min(...temp));
  const maxTemp = Math.round(Math.max(...temp));

  const sixHourSeries = sixHours.map(({ start, end }) =>
    series.find((s) => {
      const hour = s.time.substring(11, 13);
      return hour >= start && hour < end && s.data?.next_6_hours;
    })
  );

  if (sixHourSeries.every((s) => s == undefined)) {
    return null;
  }

  const weatherSymbols = sixHourSeries.map((s, i) => (
    <WeatherSymbol key={i} code={s?.data?.next_6_hours.summary.symbol_code} />
  ));

  const precip = roundOneDecimal(
    sixHourSeries.reduce((p, s) => {
      const value = s?.data?.next_6_hours?.details?.precipitation_amount;
      return p + (value !== undefined ? value : 0);
    }, 0)
  );

  const relHumidity = series.map(
    (s) => s.data.instant.details.relative_humidity
  );
  const avgHumidity = Math.round(
    relHumidity.reduce((a, b) => a + b) / relHumidity.length
  );

  const wind = series.map((s) => s.data.instant.details.wind_speed);
  const maxWind = Math.round(Math.max(...wind));

  return (
    <tr>
      <td className={styles.day}>{day}</td>
      {weatherSymbols}
      <td className={styles.temp}>
        <TemperatureValue value={maxTemp} /> /{" "}
        <TemperatureValue value={minTemp} />
      </td>
      <td className={styles.precip}>
        {precip ? i18n.t("{{precip}} mm", { precip }) : null}
      </td>
      <td className={styles.precip}>{avgHumidity}%</td>
      <td className={styles.wind}>{maxWind} m/s</td>
    </tr>
  );
};

DayForecast.propTypes = {
  date: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired,
};

export default DayForecast;
