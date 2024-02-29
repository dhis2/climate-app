import i18n from "@dhis2/d2-i18n";

export const animation = {
  duration: 300,
};

export const credits = {
  href: "https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land",
  text: i18n.t("ERA5-Land / Copernicus Climate Change Service"),
};

export const getTemperatureMonthNormal = (data, month) => {
  const monthData = data.filter((d) => d.id.substring(5, 7) === month);

  const normal =
    monthData
      .filter((d) => {
        const year = d.id.substring(0, 4);
        return year >= 1991 && year <= 2020;
      })
      .reduce((v, d) => v + d["temperature_2m"], 0) /
      30 -
    273.15;

  return Math.round(normal * 10) / 10;
};

export const getPrecipitationMonthNormal = (data, month) => {
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

export const getSelectedMonths = (data, { startMonth, endMonth }) => {
  return data.filter((d) => d.id >= startMonth && d.id <= endMonth);
};

const getYearPeriod = (startYear, endYear) =>
  `${startYear}${endYear !== startYear ? ` ${endYear}` : ""}`;

export const getMonthlyPeriod = (period) => {
  const { startMonth, endMonth } = period;
  const startYear = startMonth.substring(0, 4);
  const endYear = endMonth.substring(0, 4);
  return getYearPeriod(startYear, endYear);
};

export const getDailyPeriod = (data) => {
  const firstYear = data[0].id.substring(0, 4);
  const lastYear = data[data.length - 1].id.substring(0, 4);
  return getYearPeriod(firstYear, lastYear);
};
