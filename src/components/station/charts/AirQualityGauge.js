import i18n from "@dhis2/d2-i18n";
import legend from "../../../data/pm2.5-legend";
import { roundOneDecimal } from "../../../utils/calc";
import { airQoCredits } from "../../../utils/chart";

const thickness = 50;

const getChartConfig = (name, value, category) => ({
  title: {
    text: i18n.t("Air Quality PM 2.5"),
  },
  subtitle: {
    text: name,
  },
  credits: airQoCredits,
  chart: {
    type: "gauge",
    plotBackgroundColor: null,
    plotBackgroundImage: null,
    plotBorderWidth: 0,
    plotShadow: false,
    height: "80%",
  },
  pane: {
    startAngle: -90,
    endAngle: 90,
    background: null,
    center: ["50%", "75%"],
    size: "130%",
  },
  yAxis: {
    min: 0,
    max: 350,
    tickPosition: "inside",
    tickColor: "#FFFFFF",
    tickLength: thickness,
    tickWidth: 1,
    minorTickInterval: null,
    labels: {
      distance: 20,
      style: {
        fontSize: "14px",
      },
    },

    tickPositions: [9, 35.5, 55.5, 125.5, 225.5],
    lineWidth: 0,
    plotBands: legend.items.map((item) => ({
      ...item,
      thickness,
      borderRadius: "50%",
    })),
  },
  series: [
    {
      name: "PM2.5",
      data: [value],
      tooltip: {
        valueSuffix: " μg/m3",
      },
      dataLabels: {
        useHTML: true,
        format: `${category}<span>${roundOneDecimal(value)} μg/m3</span>`,
        borderWidth: 0,
        className: "airquality-label",
        color: "#333333",
        style: {
          fontSize: "16px",
        },
      },
      dial: {
        radius: "80%",
        backgroundColor: "#333",
        baseWidth: 12,
        baseLength: "0%",
        rearLength: "0%",
      },
      pivot: {
        backgroundColor: "#333",
        radius: 6,
      },
    },
  ],
});

export default getChartConfig;
