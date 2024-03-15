import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import { animation, credits, getDailyPeriod } from "../../../utils/chart";

const getChart = (name, data) => {
  const series = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: Math.round(d["total_precipitation_sum"] * 1000 * 10) / 10,
  }));

  // https://stackoverflow.com/questions/25576311/javascript-using-same-variable-in-calculation
  const humidity = data.map((d) => {
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
      text: i18n.t("{{name}}: Daily relative humidity {{period}}", {
        name,
        period: getDailyPeriod(data),
        nsSeparator: ";",
      }),
    },
    credits,
    tooltip: {
      valueSuffix: "%",
    },
    chart: {
      type: "column",
      height: 480,
      zoomType: "x",
      marginBottom: 75,
    },
    plotOptions: {
      series: {
        pointPadding: 0,
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
    yAxis: {
      min: 0,
      max: 100,
      title: false,
      labels: {
        format: "{value} %",
      },
    },
    series: [
      {
        data: humidity,
        name: i18n.t("Daily precipitation"),
        color: colors.blue500,
        zIndex: 1,
      },
    ],
  };
};

export default getChart;
