import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import { animation, credits, getDailyPeriod } from "../../../../utils/chart";

const getChart = (name, data) => {
  const series = data.map((d) => ({
    x: new Date(d.id).getTime(),
    y: d["total_column_carbon_monoxide_surface"] * 1000000,
  }));

  return {
    title: {
      text: i18n.t("{{name}}: Carbon monoxide {{period}}", {
        name,
        period: getDailyPeriod(data),
        nsSeparator: ";",
      }),
    },
    credits,
    tooltip: {
      valueSuffix: " mg/m^2",
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
      // max: 0.1,
      title: false,
      labels: {
        format: "{value} mg/m^2",
      },
    },
    series: [
      {
        data: series,
        name: i18n.t("Total column carbon monoxide"),
        color: colors.yellow800,
        zIndex: 1,
      },
    ],
  };
};

export default getChart;
