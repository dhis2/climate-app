import i18n from "@dhis2/d2-i18n";

// kelvin to celsius with one decimal
const temperatureParser = (v) => Math.round((v - 273.15) * 10) / 10;

export default [
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Temperature (ERA5-Land)"),
    description: i18n.t("Temperature in °C at 2m above the surface"),
    band: "temperature_2m",
    reducer: "mean",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      periodType: "hourly",
      periodReducer: "mean",
    },
    valueParser: temperatureParser,
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_max",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Max temperature (ERA5-Land)"),
    description: i18n.t("Max temperature in °C at 2m above the surface"),
    band: "temperature_2m_max",
    reducer: "max",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      periodType: "hourly",
      periodReducer: "max",
    },
    valueParser: temperatureParser,
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_min",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Min temperature (ERA5-Land)"),
    description: i18n.t("Min temperature in °C at 2m above the surface"),
    band: "temperature_2m_min",
    reducer: "min",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      periodType: "hourly",
      periodReducer: "min",
    },
    valueParser: temperatureParser,
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Precipitation (ERA5-Land)"),
    description: i18n.t("Total precipitation in mm"),
    band: "total_precipitation_sum",
    reducer: "mean",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      periodType: "hourly",
      periodReducer: "sum",
    },
    valueParser: (v) => Math.round(v * 1000 * 1000) / 1000, // meter to mm with 3 decimals
  },
  /*
  {
    id: "UCSB-CHG/CHIRPS/DAILY/precipitation",
    datasetId: "UCSB-CHG/CHIRPS/DAILY",
    name: i18n.t("Precipitation (CHIRPS)"),
    description: i18n.t("Total precipitation in mm"),
    band: "precipitation",
    reducer: "mean",
    valueParser: (v) => Math.round(v * 1000) / 1000, // 3 decimals
  },
  */
];
