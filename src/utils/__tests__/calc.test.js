import {
    getRelativeHumidity,
    getTimeFromId,
    kelvinToCelsius,
    metersToMillimeters,
    roundOneDecimal,
    toCelcius,
} from '../calc'

describe('calc utils', () => {
    it('it should round numbers to one decimal', () => {
        expect(roundOneDecimal(1)).toEqual(1)
        expect(roundOneDecimal(1.5)).toEqual(1.5)
        expect(roundOneDecimal(1.15)).toEqual(1.2)
        expect(roundOneDecimal(1.55)).toEqual(1.6)
        expect(roundOneDecimal(1.555)).toEqual(1.6)
        expect(roundOneDecimal(273.15)).toEqual(273.2)
        expect(roundOneDecimal(-273.15)).toEqual(-273.1)
    })

    it('it should convert kelvin to celsius', () => {
        expect(kelvinToCelsius(273.15)).toEqual(0)
        expect(kelvinToCelsius(0)).toEqual(-273.15)
    })

    it('it should convert kelvin to celsius and round to one decimal', () => {
        expect(toCelcius(273.15)).toEqual(0)
        expect(toCelcius(0)).toEqual(-273.1)
    })

    it('it should convert meters to millimeters', () => {
        expect(metersToMillimeters(1)).toEqual(1000)
        expect(metersToMillimeters(0.1)).toEqual(100)
        expect(metersToMillimeters(0.01)).toEqual(10)
        expect(metersToMillimeters(0.001)).toEqual(1)
        expect(metersToMillimeters(0.0001)).toEqual(0.1)
    })

    it('it should calculate relative humidity', () => {
        expect(getRelativeHumidity(20, 10)).toBeCloseTo(52.54)
        expect(getRelativeHumidity(30, 20)).toBeCloseTo(55.08)
        expect(getRelativeHumidity(10, 5)).toBeCloseTo(71.09)
    })

    it('it should convert date id to timestamp', () => {
        expect(getTimeFromId('2021-01-01')).toEqual(1609459200000)
    })
})
