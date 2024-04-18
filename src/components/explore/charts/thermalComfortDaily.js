import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import { animation, credits, getDailyPeriod } from "../../../utils/chart";
import { toCelcius } from "../../../utils/calc";

const opacity = 0.4;

export const legend = [
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
    color: `rgba(255,140,0,${opacity})`,
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
    to: 50,
    label: "Extreme<br>heat stress",
  },
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
          y: -4,
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
