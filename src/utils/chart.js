import i18n from "@dhis2/d2-i18n";

/*
import {
  toCelcius,
  kelvinToCelsius,
  metersToMillimeters,
  getRelativeHumidity,
  roundOneDecimal,
} from "./calc";
 */

const filterMonthData = (data, month) =>
  data.filter((d) => getMonthFromId(d.id) === month);

const referencePeriodFilter =
  ({ startTime, endTime }) =>
  (d) => {
    const year = getYearFromId(d.id);
    return year >= startTime && year <= endTime;
  };

const referencePeriodYearCount = ({ startTime, endTime }) =>
  endTime - startTime + 1;

const periodBandReducer = (band) => (v, d) => v + d[band];

const getYearPeriod = (startYear, endYear) =>
  `${startYear}${endYear !== startYear ? `-${endYear}` : ""}`;

export const animation = {
  duration: 300,
};

// Date fromat YYYY-MM
export const getYearFromId = (id) => id.substring(0, 4);
export const getMonthFromId = (id) => id.substring(5, 7);

/*
export const getTemperatureMonthNormal = (data, month, referencePeriod) => {
  const monthData = filterMonthData(data, month);
  const referenceYearCount = referencePeriodYearCount(referencePeriod);
  const periodFilter = referencePeriodFilter(referencePeriod);
  const periodReducer = periodBandReducer("temperature_2m");

  const normal =
    monthData.filter(periodFilter).reduce(periodReducer, 0) /
    referenceYearCount;

  return toCelcius(normal);
};
*/

/*
export const getHumidityMonthNormal = (data, month, referencePeriod) => {
  const monthData = filterMonthData(data, month);
  const referenceYearCount = referencePeriodYearCount(referencePeriod);
  const periodFilter = referencePeriodFilter(referencePeriod);

  const periodReducer = (v, d) =>
    v +
    getRelativeHumidity(
      kelvinToCelsius(d["temperature_2m"]),
      kelvinToCelsius(d["dewpoint_temperature_2m"])
    );

  return roundOneDecimal(
    monthData.filter(periodFilter).reduce(periodReducer, 0) / referenceYearCount
  );
};
*/

export const getSelectedMonths = (data, { startTime, endTime }) =>
  data.filter((d) => d.id >= startTime && d.id <= endTime);

export const getMonthlyPeriod = (data) => {
  const startMonth = data[0].id;
  const endMonth = data[data.length - 1].id;
  const startYear = startMonth.substring(0, 4);
  const endYear = endMonth.substring(0, 4);
  return getYearPeriod(startYear, endYear);
};

export const getDailyPeriod = (data) => {
  const firstYear = data[0].id.substring(0, 4);
  const lastYear = data[data.length - 1].id.substring(0, 4);
  return getYearPeriod(firstYear, lastYear);
};

export const credits = {
  href: "https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land",
  text: i18n.t(
    "ERA5-Land / Copernicus Climate Change Service / Google Earth Engine"
  ),
};
