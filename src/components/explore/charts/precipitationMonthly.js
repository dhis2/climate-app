import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import { animation } from "./chartSettings";

const getMonthNormal = (data, month) => {
  const monthData = data.filter((d) => d.id.substring(5, 7) === month);

  const normal =
    (monthData
      .filter((d) => {
        const year = d.id.substring(0, 4);
        return year >= 1991 && year <= 2020;
      })
      .reduce((v, d) => v + d["total_precipitation_sum"], 0) /
      30) *
    1000;

  return Math.round(normal * 10) / 10;
};

const getSelectedMonths = (data, { startMonth, endMonth }) => {
  return data.filter((d) => d.id >= startMonth && d.id <= endMonth);
};

const getChartConfig = (name, data, monthlyPeriod) => {
  const months = getSelectedMonths(data, monthlyPeriod);

  const series = months.map((d) => ({
    x: new Date(d.id).getTime(),
    y: Math.round(d["total_precipitation_sum"] * 1000 * 10) / 10,
  }));

  const normals = months.map((d) => ({
    x: new Date(d.id).getTime(),
    y: getMonthNormal(data, d.id.substring(5, 7)),
  }));

  return {
    title: {
      text: i18n.t("{{name}}: Monthly precipitation", {
        name,
        nsSeparator: ";",
      }),
    },
    subtitle: {
      text: i18n.t("Normals from reference period: 1991-2020"),
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      valueSuffix: " mm",
    },
    chart: {
      type: "column",
      height: 480,
    },
    plotOptions: {
      series: {
        grouping: false,
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
      title: false,
      labels: {
        format: "{value} mm",
      },
    },
    series: [
      {
        data: series,
        name: i18n.t("Monthly precipitation"),
        color: colors.blue500,
        zIndex: 1,
      },
      {
        data: normals,
        name: i18n.t("Normal precipitation"),
        color: colors.grey400,
        pointPlacement: -0.2,
        zIndex: 0,
      },
    ],
  };
};

export default getChartConfig;
