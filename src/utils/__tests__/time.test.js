import {
    extractYear,
    formatStandardDate,
    formatCalendarDate,
    fromStandardDate,
    getCalendarDate,
    getMappedPeriods,
    getNumberOfMonths,
    getNumberOfDays,
    getLastMonth,
    getStandardPeriod,
    isValidPeriod,
    padWithZeroes,
    toDateObject,
    toStandardDate,
    getPeriods,
    oneDayInMs,
    normalizeIsoDate,
    DAILY,
    WEEKLY,
    MONTHLY,
    getDateStringFromIsoDate,
} from '../time.js'

const timestamp = 1722902400000 // 2024-08-06

const gregoryCalendar = 'gregory'
const nepaliCalendar = 'nepali'
const ethiopicCalendar = 'ethiopic'

const gregoryDate = {
    year: 2024,
    month: 8,
    day: 6,
}

const gregoryDateString = '2024-08-06'
const gregoryStartDate = '2023-08-01'
const gregoryEndDate = '2024-07-31'

const gregoryPeriod = {
    startTime: gregoryStartDate,
    endTime: gregoryEndDate,
    calendar: gregoryCalendar,
    periodType: DAILY,
}

const nepaliDate = {
    year: 2081,
    month: 4,
    day: 22,
}

const nepaliDateString = '2081-04-22'
const nepaliStartDate = '2080-09-01'
const nepaliEndDate = '2081-03-31'

const nepaliPeriod = {
    startTime: nepaliStartDate,
    endTime: nepaliEndDate,
    calendar: nepaliCalendar,
    periodType: DAILY,
}

const ethiopicDate = {
    year: 2016,
    month: 11,
    day: 30,
}

const ethiopicDateString = '2016-11-30'
const ethiopicStartDate = '2016-04-01'
const ethiopicEndDate = '2016-10-30'

const ethiopicPeriod = {
    startTime: ethiopicStartDate,
    endTime: ethiopicEndDate,
    calendar: ethiopicCalendar,
    periodType: DAILY,
}

const now = new Date()
const today = formatStandardDate(now)
const tomorrow = formatStandardDate(new Date(now.getTime() + oneDayInMs))
const yesterday = formatStandardDate(new Date(now.getTime() - oneDayInMs))

const startMonth = '2023-08'
const endMonth = '2024-07'

describe('time utils', () => {
    it('it should pad a number with zeroes', () => {
        expect(padWithZeroes(1)).toEqual('01')
        expect(padWithZeroes(10)).toEqual('10')
        expect(padWithZeroes(1, 3)).toEqual('001')
    })

    it('it should format a standard date', () => {
        const date = new Date(timestamp)
        expect(formatStandardDate(date)).toEqual('2024-08-06')
    })

    it('it should format a calendar date', () => {
        expect(formatCalendarDate(gregoryDate)).toEqual(gregoryDateString)
        expect(formatCalendarDate(nepaliDate)).toEqual(nepaliDateString)
        expect(formatCalendarDate(ethiopicDate)).toEqual(ethiopicDateString)
    })

    it('it should convert calendar dates from different calendars to the standard (gregory) date', () => {
        // Define inputs and expected output locally — do not call other helpers
        const gregoryCalendarDate = '2024-08-06'
        const nepaliCalendarDate = '2081-04-22'
        const ethiopicCalendarDate = '2016-11-30'
        const expectedStandardDate = '2024-08-06'

        expect(toStandardDate(gregoryCalendarDate, 'gregory')).toEqual(
            expectedStandardDate
        )
        expect(toStandardDate(nepaliCalendarDate, 'nepali')).toEqual(
            expectedStandardDate
        )
        expect(toStandardDate(ethiopicCalendarDate, 'ethiopic')).toEqual(
            expectedStandardDate
        )
    })

    it('it should get the gregory calendar date', () => {
        expect(getCalendarDate(gregoryCalendar)).toEqual(today)
        expect(getCalendarDate(gregoryCalendar, { days: 1 })).toEqual(tomorrow)
        expect(getCalendarDate(gregoryCalendar, { days: -1 })).toEqual(
            yesterday
        )
    })

    it('it should get the nepali calendar date', () => {
        expect(getCalendarDate(nepaliCalendar)).toEqual(
            fromStandardDate(today, nepaliCalendar)
        )
        expect(getCalendarDate(nepaliCalendar, { days: 1 })).toEqual(
            fromStandardDate(tomorrow, nepaliCalendar)
        )
        expect(getCalendarDate(nepaliCalendar, { days: -1 })).toEqual(
            fromStandardDate(yesterday, nepaliCalendar)
        )
    })

    it('it should get the ethiopic calendar date', () => {
        expect(getCalendarDate(ethiopicCalendar)).toEqual(
            fromStandardDate(today, ethiopicCalendar)
        )
        expect(getCalendarDate(ethiopicCalendar, { days: 1 })).toEqual(
            fromStandardDate(tomorrow, ethiopicCalendar)
        )
        expect(getCalendarDate(ethiopicCalendar, { days: -1 })).toEqual(
            fromStandardDate(yesterday, ethiopicCalendar)
        )
    })

    it('it should get the number of months between two dates', () => {
        expect(getNumberOfMonths(startMonth, endMonth)).toEqual(12)
    })

    it('it should get the number of days between two dates', () => {
        expect(getNumberOfDays(gregoryStartDate, gregoryEndDate)).toEqual(366)
    })

    it('it should convert a date string to a date object', () => {
        expect(toDateObject(gregoryDateString)).toEqual(gregoryDate)
        expect(toDateObject(nepaliDateString)).toEqual(nepaliDate)
        expect(toDateObject(ethiopicDateString)).toEqual(ethiopicDate)
    })

    it('it should extract the year from a date string', () => {
        expect(extractYear(gregoryDateString)).toEqual(2024)
        expect(extractYear(nepaliDateString)).toEqual(2081)
        expect(extractYear(ethiopicDateString)).toEqual(2016)
    })

    it('it should get the standard period from a calendar period', () => {
        expect(getStandardPeriod(gregoryPeriod)).toEqual({
            startTime: gregoryStartDate,
            endTime: gregoryEndDate,
            calendar: gregoryCalendar,
            periodType: DAILY,
        })

        expect(getStandardPeriod(nepaliPeriod)).toEqual({
            startTime: toStandardDate(nepaliStartDate, nepaliCalendar),
            endTime: toStandardDate(nepaliEndDate, nepaliCalendar),
            calendar: nepaliCalendar,
            periodType: DAILY,
        })

        expect(getStandardPeriod(ethiopicPeriod)).toEqual({
            startTime: toStandardDate(ethiopicStartDate, ethiopicCalendar),
            endTime: toStandardDate(ethiopicEndDate, ethiopicCalendar),
            calendar: ethiopicCalendar,
            periodType: DAILY,
        })
    })

    it('it should get the previous month subtracting lag time', () => {
        expect(getLastMonth(new Date('December 1, 2024'), 10)).toEqual([
            2024, 10,
        ])
        expect(getLastMonth(new Date('December 31, 2024'), 10)).toEqual([
            2024, 11,
        ])
        expect(getLastMonth(new Date('January 1, 2025'), 10)).toEqual([
            2024, 11,
        ])
        expect(getLastMonth(new Date('January 11, 2025'), 10)).toEqual([
            2024, 12,
        ])
        expect(getLastMonth(new Date('February 1, 2025'), 10)).toEqual([
            2024, 12,
        ])
        expect(getLastMonth(new Date('February 11, 2025'), 10)).toEqual([
            2025, 1,
        ])
    })

    it('it should create mapped gregory periods', () => {
        const mappedPeriods = getMappedPeriods(getPeriods(gregoryPeriod))

        expect(mappedPeriods.get(gregoryStartDate)).toEqual('20230801')
        expect(mappedPeriods.get(gregoryEndDate)).toEqual('20240731')
    })

    it('it should create mapped nepali periods', () => {
        const mappedPeriods = getMappedPeriods(
            getPeriods({
                ...gregoryPeriod,
                calendar: nepaliCalendar,
            })
        )

        expect(mappedPeriods.get(gregoryStartDate)).toEqual('20800416')
        expect(mappedPeriods.get(gregoryEndDate)).toEqual('20810416')
    })

    it('it should create mapped ethiopic periods', () => {
        const mappedPeriods = getMappedPeriods(
            getPeriods({
                ...gregoryPeriod,
                calendar: ethiopicCalendar,
            })
        )

        expect(mappedPeriods.get(gregoryStartDate)).toEqual('20151125')
        expect(mappedPeriods.get(gregoryEndDate)).toEqual('20161124')
    })

    it('it should validate a period object', () => {
        expect(isValidPeriod(gregoryPeriod)).toEqual(true)
        expect(isValidPeriod({})).toEqual(false)
        expect(
            isValidPeriod({
                startDate: gregoryEndDate,
                endDate: gregoryStartDate,
            })
        ).toEqual(false)
    })

    it('it should generate daily periods', () => {
        const periods = getPeriods(gregoryPeriod)
        expect(periods.length).toEqual(366)
        expect(periods[0].startDate).toEqual(gregoryStartDate)
        expect(periods[periods.length - 1].endDate).toEqual(gregoryEndDate)
    })

    it('it should generate weekly periods', () => {
        const periods = getPeriods({
            ...gregoryPeriod,
            periodType: WEEKLY,
        })
        expect(periods.length).toEqual(53)
    })

    it('it should generate monthly periods', () => {
        const periods = getPeriods({
            ...gregoryPeriod,
            periodType: MONTHLY,
        })
        expect(periods.length).toEqual(12)
    })

    it('it should format Gregorian year, month and full date strings in a locale-aware way', () => {
        // Year only
        const year = '2024'
        expect(getDateStringFromIsoDate({ date: year })).toEqual('2024')

        // Year + month
        const yearMonth = '2024-08'
        expect(getDateStringFromIsoDate({ date: yearMonth })).toEqual(
            'August 2024'
        )

        // Full date
        const yearMonthDay = '2024-08-06'
        expect(getDateStringFromIsoDate({ date: yearMonthDay })).toEqual(
            'August 6, 2024'
        )

        // Fallback (unknown format) should return input unchanged
        const fallback = 'not-a-date'
        expect(getDateStringFromIsoDate({ date: fallback })).toEqual(fallback)
    })

    it('it should format an Ethiopic full date', () => {
        const date = '2016-11-30'
        const expected = 'Hedar 21, 2009 ERA0'
        expect(
            getDateStringFromIsoDate({ date, calendar: 'ethiopic' })
        ).toEqual(expected)
    })

    it('it should format a Nepali full date', () => {
        const input = '2024-08-06'
        // Returns calendar date when displayName not found
        const expected = '2081-04-22'
        expect(
            getDateStringFromIsoDate({ date: input, calendar: 'nepali' })
        ).toEqual(expected)
    })

    it('it should format an Ethiopic year-only', () => {
        const date = '2016'
        const expected = '2008'
        expect(
            getDateStringFromIsoDate({ date, calendar: 'ethiopic' })
        ).toEqual(expected)
    })

    it('it should format an Ethiopic year-month', () => {
        const date = '2016-11'
        // Returns original date when period not found in generated months
        const expected = '2016-11'
        expect(
            getDateStringFromIsoDate({ date, calendar: 'ethiopic' })
        ).toEqual(expected)
    })

    it('it should return original date for non-matching year-month in Nepali calendar', () => {
        const date = '2023-08'
        const expected = '2023-08'
        expect(getDateStringFromIsoDate({ date, calendar: 'nepali' })).toEqual(
            expected
        )
    })

    it('it should return original date when calendar conversion throws an error', () => {
        const date = 'invalid-date-format'
        const expected = 'invalid-date-format'
        expect(
            getDateStringFromIsoDate({ date, calendar: 'ethiopic' })
        ).toEqual(expected)
    })

    it('it should format strings using Gregorian Norwegian (nb) locale', () => {
        const locale = 'nb'
        // Year only
        const year = '2024'
        expect(getDateStringFromIsoDate({ date: year, locale })).toEqual('2024')

        // Year + month
        const yearMonth = '2024-08'
        expect(getDateStringFromIsoDate({ date: yearMonth, locale })).toEqual(
            'august 2024'
        )

        // Full date
        const fullDate = '2024-08-06'
        expect(getDateStringFromIsoDate({ date: fullDate, locale })).toEqual(
            '6. august 2024'
        )

        // Fallback
        const fallback = 'ikke-en-dato'
        expect(getDateStringFromIsoDate({ date: fallback, locale })).toEqual(
            fallback
        )
    })

    it('it should normalize partial ISO dates', () => {
        // Year only
        expect(normalizeIsoDate('2024')).toEqual('2024-01-01')

        // Year + month
        expect(normalizeIsoDate('2024-08')).toEqual('2024-08-01')

        // ISO week: week 1 of 2024 starts on 2024-01-01
        expect(normalizeIsoDate('2024-W01')).toEqual('2024-01-01')

        // Full date unchanged
        expect(normalizeIsoDate('2024-08-06')).toEqual('2024-08-06')

        // Invalid string returns null
        expect(normalizeIsoDate('not a date')).toEqual(null)

        // Undefined returns null
        expect(normalizeIsoDate(undefined)).toEqual(null)
    })
})
