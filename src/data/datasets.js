import i18n from "@dhis2/d2-i18n";
import {
  kelvinToCelsius,
  getRelativeHumidity,
  roundOneDecimal,
} from "../utils/calc";
import { HOURLY } from "../utils/time";

// kelvin to celsius with one decimal
const temperatureParser = (v) => roundOneDecimal(kelvinToCelsius(v));

const relativeHumidityParser = ([dewData, tempData]) =>
  tempData.map((temp, i) => ({
    ...temp,
    value: roundOneDecimal(
      getRelativeHumidity(
        kelvinToCelsius(temp.value),
        kelvinToCelsius(dewData[i].value)
      )
    ),
  }));

export default [
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Air temperature (ERA5-Land)"),
    shortName: i18n.t("Air temperature"),
    description: i18n.t(
      "Average air temperature in °C at 2 m above the surface"
    ),
    band: "temperature_2m",
    reducer: "mean",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "temperature_2m",
      periodType: HOURLY,
      periodReducer: "mean",
    },
    valueParser: temperatureParser,
    aggregationType: i18n.t("Average"),
    dataElementCode: "ERA5_LAND_TEMPERATURE",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_min",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Min temperature (ERA5-Land)"),
    shortName: i18n.t("Min air temperature"),
    description: i18n.t(
      "Minimum air temperature in °C at 2 m above the surface"
    ),
    band: "temperature_2m_min",
    reducer: "min",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "temperature_2m",
      periodType: HOURLY,
      periodReducer: "min",
    },
    valueParser: temperatureParser,
    aggregationType: i18n.t("Min"),
    dataElementCode: "ERA5_LAND_TEMPERATURE_MIN",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_max",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Max air temperature (ERA5-Land)"),
    shortName: i18n.t("Max air temperature"),
    description: i18n.t(
      "Maximum air temperature in °C at 2 m above the surface"
    ),
    band: "temperature_2m_max",
    reducer: "max",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "temperature_2m",
      periodType: "hourly",
      periodReducer: "max",
    },
    valueParser: temperatureParser,
    aggregationType: i18n.t("Max"),
    dataElementCode: "ERA5_LAND_TEMPERATURE_MAX",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Precipitation (ERA5-Land)"),
    shortName: i18n.t("Precipitation"),
    description: i18n.t("Total precipitation in mm"),
    band: "total_precipitation_sum",
    reducer: "mean",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "total_precipitation",
      periodType: HOURLY,
      periodReducer: "sum",
    },
    valueParser: (v) => Math.round(v * 1000 * 1000) / 1000, // meter to mm with 3 decimals
    aggregationType: i18n.t("Sum"),
    dataElementCode: "ERA5_LAND_PRECIPITATION",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/dewpoint_temperature_2m",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Dewpoint temperature (ERA5-Land)"),
    shortName: i18n.t("Dewpoint temperature"),
    description: i18n.t(
      "Temperature in °C at 2 m above the surface to which the air would have to be cooled for saturation to occur."
    ),
    band: "dewpoint_temperature_2m",
    reducer: "mean",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "dewpoint_temperature_2m",
      periodType: HOURLY,
      periodReducer: "mean",
    },
    valueParser: temperatureParser,
    aggregationType: i18n.t("Average"),
    dataElementCode: "ERA5_LAND_DEWPOINT_TEMPERATURE",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/relative_humidity_2m",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Relative humidity (ERA5-Land)"),
    shortName: i18n.t("Relative humidity"),
    description: i18n.t(
      "Percentage of water vapor in the air compared to the total amount of vapor that can exist in the air at its current temperature. Calculated using air temperature and dewpoint temperature at 2 m above surface."
    ),
    bands: [
      {
        band: "dewpoint_temperature_2m",
        reducer: "mean",
        timeZone: {
          datasetId: "ECMWF/ERA5_LAND/HOURLY",
          band: "dewpoint_temperature_2m",
          periodType: HOURLY,
          periodReducer: "mean",
        },
      },
      {
        band: "temperature_2m",
        reducer: "mean",
        timeZone: {
          datasetId: "ECMWF/ERA5_LAND/HOURLY",
          band: "temperature_2m",
          periodType: HOURLY,
          periodReducer: "mean",
        },
      },
    ],
    bandsParser: relativeHumidityParser,
    aggregationType: i18n.t("Average"),
    dataElementCode: "ERA5_LAND_RELATIVE_HUMIDITY",
  },
  // {
  //   id: "Local Min Tempreture",
  //   datasetId: "Local_Data",
  //   tag : 'min temp',
  //   name: i18n.t("Local Min Tempreture (Land)"),
  //   shortName: i18n.t("Air temperature"),
  //   description: i18n.t(
  //     "Average local  max observed air temperature in °C"
  //   ),
  //   aggregationType: i18n.t("Min"),
  //   dataElementCode: "LOCAL_TEMPERATURE_MAX",
  // },
  // {
  //   id: "Local Max Tempreture",
  //   datasetId: "Local_Data",
  //   tag : 'max temp',
  //   name: i18n.t("Local Max Tempreture (Land)"),
  //   shortName: i18n.t("Air temperature"),
  //   description: i18n.t(
  //     "Average local min observed air temperature in °C"
  //   ),
  //   aggregationType: i18n.t("Min"),
  //   dataElementCode: "LOCAL_TEMPERATURE_MIN",
  //   },
  {
    id: "Local Precipitation",
    datasetId: "Local_Data",
    tag : 'Rainfall',
    name: i18n.t("Local Precipitation "),
    shortName: i18n.t("Precipitation"),
    description: i18n.t(
      "Precipitation received in mm"
    ),
    aggregationType: i18n.t("Average"),
    dataElementCode: "LOCAL_TEMPERATURE_MAX",
  }
];
