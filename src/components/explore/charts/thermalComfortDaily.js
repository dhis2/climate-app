import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import {
  animation,
  heatCredits,
  strokePattern,
  getDailyPeriod,
} from "../../../utils/chart";
import { toCelcius } from "../../../utils/calc";

const opacity = 0.4;

const legend = [
  {
    color: `rgba(10,48,107,${opacity})`,
    from: -100,
    to: -40,
    label: "Extreme<br>cold stress",
  },
  {
    color: `rgba(10,82,156,${opacity})`,
    from: -40,
    to: -27,
    label: "Very strong<br>cold stress",
  },
  {
    color: `rgba(35,112,181,${opacity})`,
    from: -27,
    to: -13,
    label: "Strong<br>cold stress",
  },
  {
    color: `rgba(65,146,197,${opacity})`,
    from: -13,
    to: 0,
    label: "Moderate<br>cold stress",
  },
  {
    color: `rgba(158,203,224,${opacity})`,
    from: 0,
    to: 9,
    label: "Slight<br>cold stress",
  },
  {
    color: `rgba(216,240,162,${opacity})`,
    from: 9,
    to: 26,
    label: "No thermal<br>stress",
  },
  {
    color: `rgba(255,140,0,${opacity - 0.1})`,
    from: 26,
    to: 32,
    label: "Moderate<br>heat stress",
  },
  {
    color: `rgba(255,70,2,${opacity})`,
    from: 32,
    to: 38,
    label: "Strong<br>heat stress",
  },
  {
    color: `rgba(206,1,2,${opacity})`,
    from: 38,
    to: 46,
    label: "Very strong<br>heat stress",
  },
  {
    color: `rgba(139,1,2,${opacity})`,
    from: 46,
    to: 100,
    label: "Extreme<br>heat stress",
  },
];

export const getPlotBands = (minMax) => {
  const minValue = Math.floor(Math.min(...minMax.map((d) => d[1])));
  const maxValue = Math.ceil(Math.max(...minMax.map((d) => d[2])));

  const plotBands = legend.filter(
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

const getChart = (name, data) => {
  const series = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: toCelcius(d["utci_mean"]),
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
        period: getDailyPeriod(data),
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
  };
};

export default getChart;
