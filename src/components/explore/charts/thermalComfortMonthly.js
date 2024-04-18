import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import { animation, credits, getDailyPeriod } from "../../../utils/chart";
import { legend } from "./thermalComfortDaily";

// Get optimal band label position to avoid overlapping
const getBandLabelPosition = ({ from, to }, value) =>
  value >= from && value <= to && value - from > to - value ? "bottom" : "top";

const getChart = (name, data) => {
  const series = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: Math.round((d["utci_mean"] - 273.15) * 10) / 10,
  }));

  const minMax = data.map((d) => [
    new Date(d.id).getTime(),
    Math.round((d["utci_min"] - 273.15) * 10) / 10,
    Math.round((d["utci_max"] - 273.15) * 10) / 10,
  ]);

  const firstValue = series[0].y;
  const minValue = Math.ceil(Math.min(...minMax.map((d) => d[1])));
  const maxValue = Math.floor(Math.max(...minMax.map((d) => d[2])));

  // https://www.highcharts.com/demo/highcharts/arearange-line
  return {
    title: {
      text: i18n.t("{{name}}: Thermal comfort {{period}}", {
        name,
        period: getDailyPeriod(data),
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
    yAxis: {
      // min: minValue > 0 ? 0 : undefined,
      // min: 10, // TODO
      title: false,
      labels: {
        format: "{value}°C",
      },
      gridLineWidth: 0,
      plotBands: legend
        .filter((l) => l.to >= minValue && l.from <= maxValue)
        .map((l) => {
          const verticalAlign = getBandLabelPosition(l, firstValue);
          return {
            ...l,
            label: {
              text: l.label,
              verticalAlign,
              y: verticalAlign === "bottom" ? -13 : 20,
            },
          };
        }),
      plotLines: legend.map((l) => ({
        value: l.from,
        width: 1,
        // color: "#FFFFFF",
      })) /*[
        {
          color: "#FF0000",
          width: 2,
          value: 5.5,
        },
      ]*/,
    },
    chart: {
      height: 480,
      marginBottom: 75,
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
        name: i18n.t("Average felt temperature"),
        color: colors.red900,
        lineWidth: 1,
        zIndex: 2,
        marker: {
          enabled: false,
        },
      },
      {
        type: "arearange",
        name: i18n.t("Felt temperature range"),
        data: minMax,
        // color: colors.red200,
        // negativeColor: colors.blue200,
        color: {
          pattern: {
            color: "rgba(0,0,0,.15)",
            path: "M -5 15 L 15 -5M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2",
            width: 4,
            height: 4,
          },
        },
        marker: {
          enabled: false,
        },
        zIndex: 0,
      },
    ],
  };
};

export default getChart;
