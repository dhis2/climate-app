import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import {
  animation,
  credits,
  getMonthlyPeriod,
  getMonthFromId,
} from "../../../../utils/chart";
import { getTimeFromId, metersToMillimeters } from "../../../../utils/calc";

const band = "total_precipitation_sum";

const getChartConfig = (name, data, normals, referencePeriod, settings) => {
  const { precipMonthlyMax } = settings;

  const series = data.map((d) => ({
    x: getTimeFromId(d.id),
    y: metersToMillimeters(d[band]),
  }));

  const monthMormals = data.map((d) => {
    const month = getMonthFromId(d.id);
    const normal = normals.find((n) => n.id === month);

    return {
      x: getTimeFromId(d.id),
      y: metersToMillimeters(normal[band]),
    };
  });

  return {
    title: {
      text: i18n.t("{{name}}: Monthly precipitation {{period}}", {
        name,
        period: getMonthlyPeriod(data),
        nsSeparator: ";",
      }),
    },
    subtitle: {
      text: i18n.t("Normals from reference period: {{period}}", {
        period: referencePeriod.id,
        nsSeparator: ";",
      }),
    },
    credits,
    tooltip: {
      shared: true,
      valueSuffix: " mm",
    },
    chart: {
      type: "column",
      height: 480,
      marginBottom: 75,
    },
    plotOptions: {
      series: {
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
      max: precipMonthlyMax,
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
        data: monthMormals,
        name: i18n.t("Normal precipitation"),
        color: colors.blue200,
        pointPlacement: -0.1,
        zIndex: 0,
      },
    ],
  };
};

export default getChartConfig;
