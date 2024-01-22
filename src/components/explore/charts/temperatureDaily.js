import i18n from "@dhis2/d2-i18n";

const convertDate = (date) => new Date(date).getTime();

const getChart = (meanData, minData, maxData) => {
  const series = meanData.map((d) => ({
    x: convertDate(d.period),
    y: d.value,
  }));

  const minMax = meanData.map((d, i) => [
    convertDate(d.period),
    minData[i].value,
    maxData[i].value,
  ]);

  const minValue = Math.min(...minMax.map((d) => d[1]));

  // https://www.highcharts.com/demo/highcharts/arearange-line
  // Colors: https://ui.dhis2.nu/principles/color/#color-scale-reference
  return {
    title: {
      text: i18n.t("Daily temperatures"),
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
      min: minValue > 0 ? 0 : undefined,
      title: false,
      labels: {
        format: "{value}°C",
      },
    },
    chart: {
      height: 480,
      zoomType: "x",
    },
    series: [
      {
        type: "line",
        data: series,
        name: i18n.t("Mean temperature"),
        color: "#891515", // red800
        negativeColor: "#0d47a1", // blue800
        zIndex: 2,
      },
      {
        type: "arearange",
        name: i18n.t("Temperature range"),
        data: minMax,
        color: "#ffcdd2", // red200
        negativeColor: "#c5e3fc", // blue200
        marker: {
          enabled: false,
        },
        zIndex: 0,
      },
    ],
  };
};

export default getChart;
