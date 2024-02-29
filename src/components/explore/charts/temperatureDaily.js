import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import { animation } from "./chartSettings";

const getChart = (name, data) => {
  const series = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: Math.round((d["temperature_2m"] - 273.15) * 10) / 10,
  }));

  const minMax = data.map((d) => [
    new Date(d.id).getTime(),
    Math.round((d["temperature_2m_min"] - 273.15) * 10) / 10,
    Math.round((d["temperature_2m_max"] - 273.15) * 10) / 10,
  ]);

  // https://www.highcharts.com/demo/highcharts/arearange-line

  return {
    title: {
      text: i18n.t("{{name}}: Daily temperatures", {
        name,
        nsSeparator: ";",
      }),
    },
    credits: {
      enabled: false,
    },
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
    yAxis: {
      // min: minValue > 0 ? 0 : undefined,
      title: false,
      labels: {
        format: "{value}°C",
      },
    },
    chart: {
      height: 480,
      zoomType: "x",
    },
    plotOptions: {
      series: {
        animation,
      },
    },
    series: [
      {
        type: "line",
        data: series,
        name: i18n.t("Mean temperature"),
        color: colors.red800,
        negativeColor: colors.blue800,
        zIndex: 2,
      },
      {
        type: "arearange",
        name: i18n.t("Temperature range"),
        data: minMax,
        color: colors.red200,
        negativeColor: colors.blue200,
        marker: {
          enabled: false,
        },
        zIndex: 0,
      },
    ],
  };
};

export default getChart;
