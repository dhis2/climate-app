// https://stackoverflow.com/questions/25576311/javascript-using-same-variable-in-calculation
export const getRelativeHumidity = (temperature, dewpoint) =>
  (100 * ((17.625 * dewpoint) / (243.04 + dewpoint))) /
  ((17.625 * temperature) / (243.04 + temperature));

export const kelvinToCelsius = (k) => k - 273.15;

export const roundOneDecimal = (v) => Math.round(v * 10) / 10;

export const getTimeFromId = (id) => new Date(id).getTime();
