import i18n from "@dhis2/d2-i18n";

const convertDate = (date) => new Date(date).getTime();

const getChart = (data) => {
  const series = data.map((d) => ({
    x: convertDate(d.period),
    y: d.value,
  }));

  return {
    title: {
      text: i18n.t("Daily precipitation - CHIRPS"),
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      valueSuffix: " mm",
    },
    chart: {
      type: "column",
      height: 480,
      zoomType: "x",
    },
    plotOptions: {
      series: {
        pointPadding: 0,
        groupPadding: 0,
        borderWidth: 0,
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
      title: false,
      labels: {
        format: "{value} mm",
      },
    },
    series: [
      {
        data: series,
        name: i18n.t("Daily precipitation"),
        color: "#2196f3", // blue500
        zIndex: 1,
      },
    ],
  };
};

export default getChart;
