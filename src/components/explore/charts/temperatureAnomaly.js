import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import {
  animation,
  credits,
  getTemperatureMonthNormal,
} from "../../../utils/chart";
import { roundOneDecimal, kelvinToCelsius } from "../../../utils/calc";
import { months } from "../MonthSelect";

// https://climate.copernicus.eu/copernicus-september-2023-unprecedented-temperature-anomalies
// https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_LAND_MONTHLY_AGGR
const getChartConfig = (name, data, month, referencePeriod) => {
  const monthData = data.filter(
    (d) => d.id.substring(5, 7) === month && d.id.substring(0, 4) >= "1970"
  );
  const monthName = months.find((m) => m.id === month).name;
  const normal = getTemperatureMonthNormal(data, month, referencePeriod);
  const years = monthData.map((d) => d.id.substring(0, 4));
  const series = monthData.map((d) =>
    roundOneDecimal(kelvinToCelsius(d["temperature_2m"]) - normal)
  );

  return {
    title: {
      text: i18n.t("{{name}}: {{month}} temperature anomaly {{years}}", {
        name,
        month: monthName,
        years: `${years[0]}-${years[years.length - 1]}`,
        nsSeparator: ";",
      }),
    },
    subtitle: {
      text: i18n.t("Reference period: {{period}}", {
        period: referencePeriod,
        nsSeparator: ";",
      }),
    },
    credits,
    tooltip: {
      shared: true,
      valueSuffix: "°C",
    },
    chart: {
      type: "column",
      height: 480,
      marginBottom: 60,
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
