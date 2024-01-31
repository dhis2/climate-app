import i18n from "@dhis2/d2-i18n";
import { getMonthNormal } from "./temperatureMonthly";

// https://climate.copernicus.eu/copernicus-september-2023-unprecedented-temperature-anomalies
// https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_LAND_MONTHLY_AGGR
const getChartConfig = (data, month) => {
  const monthData = data.filter((d) => d.id.substring(5, 7) === month);
  const normal = getMonthNormal(data, month);
  const years = monthData.map((d) => d.id.substring(0, 4));
  const series = monthData.map(
    (d) => Math.round((d["temperature_2m"] - 273.15 - normal) * 10) / 10
  );

  return {
    title: {
      text: i18n.t("Temperature anomaly"),
    },
    subtitle: {
      text: i18n.t("Reference period: 1991-2020"),
    },
    credits: {
      enabled: false,
    },
    exporting: {
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
        color: "var(--colors-red500)",
        negativeColor: "var(--colors-blue500)",
      },
    ],
    legend: { enabled: false },
  };
};

export default getChartConfig;
