import i18n from "@dhis2/d2-i18n";
import {
  toCelcius,
  kelvinToCelsius,
  metersToMillimeters,
  getRelativeHumidity,
  roundOneDecimal,
} from "./calc";

const filterMonthData = (data, month) =>
  data.filter((d) => getMonthFromId(d.id) === month);

const referencePeriodFilter =
  ([startYear, endYear]) =>
  (d) => {
    const year = getYearFromId(d.id);
    return year >= startYear && year <= endYear;
  };

const referencePeriodYearCount = ([startYear, endYear]) =>
  endYear - startYear + 1;

const periodBandReducer = (band) => (v, d) => v + d[band];

const referencePeriodYearRange = (referencePeriod) =>
  referencePeriod.split("-").map(Number);

const getYearPeriod = (startYear, endYear) =>
  `${startYear}${endYear !== startYear ? `-${endYear}` : ""}`;

export const animation = {
  duration: 300,
};

// Date fromat YYYY-MM
export const getYearFromId = (id) => id.substring(0, 4);
export const getMonthFromId = (id) => id.substring(5, 7);

export const getTemperatureMonthNormal = (data, month, referencePeriod) => {
  const monthData = filterMonthData(data, month);
  const referenceYearRange = referencePeriodYearRange(referencePeriod);
  const referenceYearCount = referencePeriodYearCount(referenceYearRange);
  const periodFilter = referencePeriodFilter(referenceYearRange);
  const periodReducer = periodBandReducer("temperature_2m");

  const normal =
    monthData.filter(periodFilter).reduce(periodReducer, 0) /
    referenceYearCount;

  return toCelcius(normal);
};

export const getPrecipitationMonthNormal = (data, month, referencePeriod) => {
  const monthData = filterMonthData(data, month);
  const referenceYearRange = referencePeriodYearRange(referencePeriod);
  const referenceYearCount = referencePeriodYearCount(referenceYearRange);
  const periodFilter = referencePeriodFilter(referenceYearRange);
  const periodReducer = periodBandReducer("total_precipitation_sum");

  return metersToMillimeters(
    monthData.filter(periodFilter).reduce(periodReducer, 0) / referenceYearCount
  );
};

export const getHumidityMonthNormal = (data, month, referencePeriod) => {
  const monthData = filterMonthData(data, month);
  const referenceYearRange = referencePeriodYearRange(referencePeriod);
  const referenceYearCount = referencePeriodYearCount(referenceYearRange);
  const periodFilter = referencePeriodFilter(referenceYearRange);

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

export const getSelectedMonths = (data, { startMonth, endMonth }) =>
  data.filter((d) => d.id >= startMonth && d.id <= endMonth);

export const getMonthlyPeriod = (period) => {
  const { startMonth, endMonth } = period;
  const startYear = startMonth.substring(0, 4);
  const endYear = endMonth.substring(0, 4);
  return getYearPeriod(startYear, endYear);
};

export const getDailyPeriod = (data) => {
  const firstYear = data[0].id.substring(0, 4);
  const lastYear = data[data.length - 1].id.substring(0, 4);
  return getYearPeriod(firstYear, lastYear);
};

export const strokePattern = {
  pattern: {
    color: "rgba(0,0,0,.2)",
    path: "M -5 15 L 15 -5M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2",
    width: 4,
    height: 4,
  },
};

export const credits = {
  href: "https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land",
  text: i18n.t(
    "ERA5-Land / Copernicus Climate Change Service / Google Earth Engine"
  ),
};

export const heatCredits = {
  href: "https://cds.climate.copernicus.eu/cdsapp#!/dataset/derived-utci-historical",
  text: i18n.t(
    "ERA5-HEAT / Copernicus Climate Change Service / Google Earth Engine"
  ),
};
