import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import { animation, credits } from "../../../utils/chart";
import Polyfit from "../../../utils/polyfit";

const getChartConfig = (name, data) => {
  const years = [...new Set(data.map((d) => d.year))];
  const models = [...new Set(data.map((d) => d.model))];
  const firstYear = years[0];
  const lastYear = years[years.length - 1];

  const modelData = data.filter((d) => d.model === "ACCESS-CM2");

  /*
  const series = modelData.map((d) => ({
    x: d.year,
    y: d.value,
  }));
  */

  const series = years.map((year) => {
    const values = data.filter((d) => d.year === year).map((d) => d.value);
    return {
      x: year,
      y: values.reduce((a, b) => a + b, 0) / values.length,
    };
  });

  // const minMax = modelData.map((d) => [d.year, d.min, d.max]);
  const minMax = years.map((year) => {
    const values = data.filter((d) => d.year === year).map((d) => d.value);
    return [year, Math.min(...values), Math.max(...values)];
  });

  const poly = new Polyfit(
    years,
    modelData.map((d) => d.value)
  );

  const solver = poly.getPolynomial(2);

  const trendSeries = years.map((year) => ({
    x: year,
    y: solver(year),
  }));

  // https://www.highcharts.com/demo/highcharts/arearange-line
  return {
    title: {
      text: i18n.t("{{name}}: Yearly mean temperatures {{period}}", {
        name,
        period: `${firstYear}-${lastYear}`,
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
        type: "line",
        data: series,
        name: i18n.t("Mean temperature"),
        color: colors.red800,
        negativeColor: colors.blue800,
        // zIndex: 2,
        marker: {
          enabled: false,
        },
      },
      {
        type: "arearange",
        name: i18n.t("Temperature range"),
        data: minMax,
        color: colors.red200,
        negativeColor: colors.blue200,
        marker: {
          enabled: false,
        },
        zIndex: 0,
      },
      /*
      {
        type: "spline",
        data: trendSeries,
        name: i18n.t("Temperature trend"),
        color: colors.red800,
        negativeColor: colors.blue800,
        // zIndex: 2,
        marker: {
          enabled: false,
        },
      },
      */
    ],
  };
};

export default getChartConfig;
