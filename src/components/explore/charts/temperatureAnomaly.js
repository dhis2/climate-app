import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui"; // https://github.com/dhis2/ui/blob/master/constants/src/colors.js
import { getMonthNormal } from "./temperatureMonthly";
import { animation } from "./chartSettings";

// https://climate.copernicus.eu/copernicus-september-2023-unprecedented-temperature-anomalies
// https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_LAND_MONTHLY_AGGR
const getChartConfig = (name, data, month) => {
  const monthData = data.filter((d) => d.id.substring(5, 7) === month);
  const normal = getMonthNormal(data, month);
  const years = monthData.map((d) => d.id.substring(0, 4));
  const series = monthData.map(
    (d) => Math.round((d["temperature_2m"] - 273.15 - normal) * 10) / 10
  );

  return {
    title: {
      text: i18n.t("{{name}}: Temperature anomaly", {
        name,
        nsSeparator: ";",
      }),
    },
    subtitle: {
      text: i18n.t("Reference period: 1991-2020", {
        nsSeparator: ";",
      }),
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      valueSuffix: "°C",
    },
    chart: {
      type: "column",
      height: 480,
    },
    plotOptions: {
      column: {
        pointWidth: 13,
        pointPadding: 0,
        borderWidth: 1,
      },
      series: {
        animation,
      },
    },
    xAxis: {
      type: "category",
      categories: years,
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
    series: [
      {
        data: series,
        name: i18n.t("Temperature anomaly"),
        color: colors.red500,
        negativeColor: colors.blue500,
      },
    ],
    legend: { enabled: false },
  };
};

export default getChartConfig;
