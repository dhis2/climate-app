// Based on: https://bmcnoldy.earth.miami.edu/Humidity.html
export const getRelativeHumidity = (temperature, dewpoint) =>
    (100 * Math.exp((17.625 * dewpoint) / (243.04 + dewpoint))) /
    Math.exp((17.625 * temperature) / (243.04 + temperature))

export const roundOneDecimal = (v) => Math.round(v * 10) / 10

export const roundTwoDecimals = (v) => Math.round(v * 100) / 100

export const kelvinToCelsius = (k) => k - 273.15

export const toCelcius = (k) => roundOneDecimal(kelvinToCelsius(k))

export const getTimeFromId = (id) => new Date(id).getTime()

export const metersToMillimeters = (m) => roundOneDecimal(m * 1000)
