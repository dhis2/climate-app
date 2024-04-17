import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import { animation, credits, getMonthlyPeriod } from "../../../utils/chart";

const getChartConfig = (name, data) => {
  const series = data.map((d) => ({
    x: d.year,
    y: d.value,
  }));

  console.log("series", series, data);

  // https://www.highcharts.com/demo/highcharts/arearange-line
  return {
    title: {
      text: i18n.t("{{name}}: Yearly mean temperatures {{period}}", {
        name,
        period: "2020-2100", // TODO: get period from data
        nsSeparator: ";",
      }),
    },
    /*
    subtitle: {
      text: i18n.t("Normals from reference period: {{period}}", {
        period: referencePeriod,
        nsSeparator: ";",
      }),
    },
    */
    credits,
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: "°C",
    },
    /*
    xAxis: {
      type: "year",
      // tickInterval: 2592000000,
      labels: {
        format: "{value: %b}",
      },
    },
    */
    yAxis: {
      // min: minValue > 0 ? 0 : undefined,
      title: false,
      labels: {
        format: "{value}°C",
      },
    },
    chart: {
      height: 480,
      marginBottom: 75,
    },
    plotOptions: {
      series: {
        animation,
      },
    },
    series: [
      {
        type: "spline",
        data: series,
        name: i18n.t("Mean temperature"),
        color: colors.red800,
        negativeColor: colors.blue800,
        zIndex: 2,
      },
    ],
  };
};

export default getChartConfig;
