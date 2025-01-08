import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import legend from "../../../../data/heat-stress-legend";
import {
  animation,
  heatCredits,
  strokePattern,
  getDailyPeriod,
} from "../../../../utils/chart";
import { toCelcius } from "../../../../utils/calc";

export const getPlotBands = (minMax, settings = {}) => {
  const { heatMin, heatMax } = settings;

  const minValue =
    heatMin !== undefined
      ? heatMin
      : Math.floor(Math.min(...minMax.map((d) => d[1])));

  const maxValue =
    heatMax !== undefined
      ? heatMax
      : Math.ceil(Math.max(...minMax.map((d) => d[2])));

  const plotBands = legend.items.filter(
    (l) => l.to >= minValue && l.from <= maxValue
  );
  const firstBand = plotBands[0];
  const lastBand = plotBands[plotBands.length - 1];

  if (firstBand.to === -40) {
    firstBand.from = minValue >= -45 ? -45 : minValue;
  }

  if (lastBand.from === 46) {
    lastBand.to = maxValue <= 50 ? 50 : maxValue;
  }

  return plotBands.map((l) => ({
    ...l,
    label: {
      text: l.label,
      align: "right",
      verticalAlign: "middle",
      textAlign: "left",
      y: -4,
    },
  }));
};

export const getPlotLines = (plotBands) =>
  plotBands.map((l) => ({
    value: l.from,
    width: 1,
    color: "rgba(0,0,0,0.1)",
    zIndex: 1,
  }));

export const getThickPositons = (plotBands) => [
  ...plotBands.map((b) => b.from),
  plotBands[plotBands.length - 1].to,
];

const getChart = (name, data, settings, isPlugin) => {
  const series = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: toCelcius(d["utci_mean"]),
  }));

  const minMax = data.map((d) => [
    new Date(d.id).getTime(),
    toCelcius(d["utci_min"]),
    toCelcius(d["utci_max"]),
  ]);

  const plotBands = getPlotBands(minMax, settings);
  const plotLines = getPlotLines(plotBands);
  const tickPositions = getThickPositons(plotBands);

  return {
    title: !isPlugin
      ? {
          text: i18n.t("{{name}}: Thermal comfort {{period}}", {
            name,
            period: getDailyPeriod(data),
            nsSeparator: ";",
          }),
        }
      : "",
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
        color: strokePattern,
        marker: {
          enabled: false,
        },
        zIndex: 0,
      },
    ],
    exporting: {
      enabled: !isPlugin,
    },
  };
};

export default getChart;
