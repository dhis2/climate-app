import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import {
  animation,
  heatCredits,
  strokePattern,
  getMonthlyPeriod,
} from "../../../../utils/chart";
import { toCelcius } from "../../../../utils/calc";
import {
  getPlotBands,
  getPlotLines,
  getThickPositons,
} from "./thermalComfortDaily";

const getChart = (name, data) => {
  const series = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: toCelcius(d["utci_mean"]),
  }));

  const temperatures = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: toCelcius(d["temperature_2m"]),
  }));

  const minMax = data.map((d) => [
    new Date(d.id).getTime(),
    toCelcius(d["utci_min"]),
    toCelcius(d["utci_max"]),
  ]);

  const plotBands = getPlotBands(minMax);
  const plotLines = getPlotLines(plotBands);
  const tickPositions = getThickPositons(plotBands);

  return {
    title: {
      text: i18n.t("{{name}}: Thermal comfort {{period}}", {
        name,
        period: getMonthlyPeriod(data),
        nsSeparator: ";",
      }),
    },
    credits: heatCredits,
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
      title: false,
      tickPositions,
      labels: {
        format: "{value}°C",
      },
      gridLineWidth: 0,
      plotBands,
      plotLines,
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
        color: strokePattern,
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
