import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import {
  animation,
  credits,
  getSelectedMonths,
  getMonthlyPeriod,
  getHumidityMonthNormal,
} from "../../../utils/chart";
import {
  getRelativeHumidity,
  kelvinToCelsius,
  roundOneDecimal,
  getTimeFromId,
} from "../../../utils/calc";

const getChartConfig = (name, data, monthlyPeriod, referencePeriod) => {
  const months = getSelectedMonths(data, monthlyPeriod);

  const dewpoint = months.map((d) => ({
    x: getTimeFromId(d.id),
    y: roundOneDecimal(kelvinToCelsius(d["dewpoint_temperature_2m"])),
  }));

  const temperature = months.map((d) => ({
    x: getTimeFromId(d.id),
    y: roundOneDecimal(kelvinToCelsius(d["temperature_2m"])),
  }));

  const humidity = months.map((d) => ({
    x: getTimeFromId(d.id),
    y: roundOneDecimal(
      getRelativeHumidity(
        kelvinToCelsius(d["temperature_2m"]),
        kelvinToCelsius(d["dewpoint_temperature_2m"])
      )
    ),
  }));

  const normals = months.map((d) => ({
    x: getTimeFromId(d.id),
    y: getHumidityMonthNormal(data, d.id.substring(5, 7), referencePeriod),
  }));

  // https://www.highcharts.com/demo/highcharts/arearange-line
  return {
    title: {
      text: i18n.t("{{name}}: Relative humidity {{period}}", {
        name,
        period: getMonthlyPeriod(monthlyPeriod),
        nsSeparator: ";",
      }),
    },
    subtitle: {
      text: i18n.t("Normals from reference period: {{period}}", {
        period: referencePeriod,
        nsSeparator: ";",
      }),
    },
    credits,
    chart: {
      height: 480,
      marginBottom: 75,
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: "°C",
    },
    plotOptions: {
      series: {
        groupPadding: 0,
        borderWidth: 0,
        animation,
      },
    },
    xAxis: {
      type: "datetime",
      tickInterval: 2592000000,
      labels: {
        format: "{value: %b}",
      },
    },
    yAxis: [
      {
        title: {
          text: "Relative humidity",
        },
        labels: {
          format: "{value}%",
        },
      },
      {
        title: {
          text: "Temperature",
        },
        labels: {
          format: "{value}°C",
        },
        opposite: true,
      },
    ],
    series: [
      {
        name: "Relative humidity",
        type: "column",
        data: humidity,
        color: colors.blue500,
        tooltip: {
          valueSuffix: "%",
        },
        zIndex: 1,
      },
      {
        name: i18n.t("Normal humidity"),
        type: "column",
        data: normals,
        color: colors.blue200,
        pointPlacement: -0.1,
        zIndex: 0,
      },
      {
        type: "line",
        data: dewpoint,
        yAxis: 1,
        name: i18n.t("Dewpoint temperature"),
        color: colors.grey900,
        zIndex: 2,
      },
      {
        type: "line",
        data: temperature,
        yAxis: 1,
        name: i18n.t("Air temperature"),
        dashStyle: "shortdot",
        color: colors.grey900,
        zIndex: 2,
      },
    ],
  };
};

export default getChartConfig;
