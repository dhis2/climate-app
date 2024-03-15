import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import {
  animation,
  credits,
  getSelectedMonths,
  getMonthlyPeriod,
} from "../../../utils/chart";

const getChartConfig = (name, data, monthlyPeriod, referencePeriod) => {
  const months = getSelectedMonths(data, monthlyPeriod);

  const dewpoint = months.map((d) => ({
    x: new Date(d.id).getTime(),
    y: Math.round((d["dewpoint_temperature_2m"] - 273.15) * 10) / 10,
  }));

  const temperature = months.map((d) => ({
    x: new Date(d.id).getTime(),
    y: Math.round((d["temperature_2m"] - 273.15) * 10) / 10,
  }));

  // https://stackoverflow.com/questions/25576311/javascript-using-same-variable-in-calculation
  const humidity = months.map((d) => {
    const temp = d["temperature_2m"] - 273.15;
    const dew = d["dewpoint_temperature_2m"] - 273.15;

    return {
      x: new Date(d.id).getTime(),
      y:
        Math.round(
          ((100 * ((17.625 * dew) / (243.04 + dew))) /
            ((17.625 * temp) / (243.04 + temp))) *
            10
        ) / 10,
    };
  });

  // https://www.highcharts.com/demo/highcharts/arearange-line
  return {
    title: {
      text: i18n.t("{{name}}: Humidity {{period}}", {
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
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: "°C",
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
        title: "Temperature",
        labels: {
          format: "{value}°C",
        },
      },
      {
        title: "Relative humidity",
        labels: {
          format: "{value}%",
        },
        opposite: true,
      },
    ],
    chart: {
      height: 480,
      marginBottom: 75,
    },
    plotOptions: {
      series: {
        animation,
      },
    },
    series: [
      {
        name: "Relative humidity",
        type: "column",
        yAxis: 1,
        data: humidity,
        tooltip: {
          valueSuffix: "%",
        },
      },
      {
        type: "line",
        data: dewpoint,
        name: i18n.t("Mean dewpoint temperature"),
        color: colors.red800,
        negativeColor: colors.blue800,
        zIndex: 2,
      },
      {
        type: "line",
        data: temperature,
        name: i18n.t("Mean temperature"),
        color: colors.red300,
        negativeColor: colors.blue300,
        zIndex: 2,
      },
    ],
  };
};

export default getChartConfig;
