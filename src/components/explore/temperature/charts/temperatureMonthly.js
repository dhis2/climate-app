import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import {
  animation,
  credits,
  getMonthlyPeriod,
  getMonthFromId,
} from "../../../../utils/chart";
import { getTimeFromId, toCelcius } from "../../../../utils/calc";

const getChartConfig = (
  name,
  data,
  normals,
  referencePeriod,
  isPlugin = false
) => {
  const series = data.map((d) => ({
    x: getTimeFromId(d.id),
    y: toCelcius(d["temperature_2m"]),
  }));

  const minMax = data.map((d) => [
    getTimeFromId(d.id),
    toCelcius(d["temperature_2m_min"]),
    toCelcius(d["temperature_2m_max"]),
  ]);

  const monthMormals = data.map((d) => {
    const month = getMonthFromId(d.id);
    const normal = normals.find((n) => n.id === month);

    return {
      x: getTimeFromId(d.id),
      y: toCelcius(normal["temperature_2m"]),
    };
  });

  return {
    title: {
      text: !isPlugin
        ? i18n.t("{{name}}: Monthly temperatures {{period}}", {
            name,
            period: getMonthlyPeriod(data),
            nsSeparator: ";",
          })
        : "",
    },
    subtitle: {
      text: i18n.t("Normals from reference period: {{period}}", {
        period: referencePeriod.id,
        nsSeparator: ";",
      }),
      floating: false,
      verticalAlign: "top",
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
        zIndex: 2,
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
      {
        type: "spline",
        data: monthMormals,
        name: i18n.t("Normal temperature"),
        dashStyle: "dash",
        color: colors.red500,
        negativeColor: colors.blue500,
        marker: {
          enabled: false,
        },
        zIndex: 1,
      },
    ],
    exporting: {
      enabled: !isPlugin,
    },
  };
};

export default getChartConfig;
