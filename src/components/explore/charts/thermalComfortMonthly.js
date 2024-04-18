import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import {
  animation,
  credits,
  getSelectedMonths,
  getMonthlyPeriod, // TODO
} from "../../../utils/chart";
import { toCelcius } from "../../../utils/calc";
import { legend } from "./thermalComfortDaily";

const getChart = (name, data, monthlyPeriod, era5Data) => {
  const months = getSelectedMonths(era5Data, monthlyPeriod);

  const series = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: toCelcius(d["utci_mean"]),
  }));

  const temperatures = months.map((d) => ({
    x: new Date(d.id).getTime(),
    y: toCelcius(d["temperature_2m"]),
  }));

  const minMax = data.map((d) => [
    new Date(d.id).getTime(),
    toCelcius(d["utci_min"]),
    toCelcius(d["utci_max"]),
  ]);

  const firstValue = series[0].y;
  const minValue = Math.ceil(Math.min(...minMax.map((d) => d[1])));
  const maxValue = Math.floor(Math.max(...minMax.map((d) => d[2])));

  const plotBands = legend.filter(
    (l) => l.to >= minValue && l.from <= maxValue
  );
  const lastBand = plotBands[plotBands.length - 1];

  // https://www.highcharts.com/demo/highcharts/arearange-line
  return {
    title: {
      text: i18n.t("{{name}}: Thermal comfort {{period}}", {
        name,
        period: "", // getMonthlyPeriod(data), TODO
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
      tickPositions: [...plotBands.map((b) => b.from), lastBand.to],
      labels: {
        format: "{value}°C",
      },
      gridLineWidth: 0,
      plotBands: plotBands.map((l) => ({
        ...l,
        label: {
          text: l.label,
          align: "right",
          verticalAlign: "middle",
          textAlign: "left",
        },
      })),
      plotLines: legend.map((l) => ({
        value: l.from,
        width: 1,
        color: "rgba(0,0,0,0.1)",
        zIndex: 1,
      })),
    },
    chart: {
      height: 480,
      marginBottom: 75,
      marginRight: 100,
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
        lineWidth: 2,
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
      {
        type: "line",
        data: temperatures,
        name: i18n.t("Average temperature"),
        color: colors.red900,
        lineWidth: 1,
        dashStyle: "dash",
        zIndex: 2,
        marker: {
          enabled: false,
        },
      },
    ],
  };
};

export default getChart;
