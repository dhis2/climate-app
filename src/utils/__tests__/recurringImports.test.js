import { computeFillGapRange } from '../recurringImports.js'
import {
    DAILY,
    MONTHLY,
    WEEKLY,
    YEARLY,
    formatStandardDate,
    oneDayInMs,
} from '../time.js'

const now = new Date()
const today = formatStandardDate(now)
const yesterday = formatStandardDate(new Date(now.getTime() - oneDayInMs))
const dow = now.getDay() // 0 = Sun, 1 = Mon, …, 6 = Sat
const lastWeekEnd = formatStandardDate(
    new Date(now.getTime() - (dow === 0 ? 7 : dow) * oneDayInMs)
)
const lastMonthEnd = formatStandardDate(
    new Date(now.getFullYear(), now.getMonth(), 0)
)
const currentYear = String(now.getFullYear())
const lastYear = String(now.getFullYear() - 1)

describe('computeFillGapRange', () => {
    // computeFillGapRange computes the date range to cover when running a
    // saved import config. It starts from the last recorded import point and
    // ends at the last complete period (not today, since data for in-progress
    // periods does not yet exist). It returns null when there is nothing new
    // to import.
    //
    // it re-covers from that point forward to catch any
    // values that may have been missing or updated.

    it('returns null when no previous import has been recorded', () => {
        expect(computeFillGapRange({})).toBeNull()
        expect(computeFillGapRange({ periodType: DAILY })).toBeNull()
        expect(computeFillGapRange(null)).toBeNull()
    })

    it('DAILY: starts from dataUpdatedThrough and ends at yesterday', () => {
        const config = {
            periodType: DAILY,
            dataUpdatedThrough: '2024-01-15',
        }
        const result = computeFillGapRange(config)
        expect(result.startTime).toEqual('2024-01-15')
        expect(result.endTime).toEqual(yesterday)
        expect(result.periodType).toEqual(DAILY)
    })

    it('WEEKLY: starts from dataUpdatedThrough and ends at the previous Sunday', () => {
        const config = {
            periodType: WEEKLY,
            dataUpdatedThrough: '2024-01-07',
        }
        const result = computeFillGapRange(config)
        expect(result.startTime).toEqual('2024-01-07')
        expect(result.endTime).toEqual(lastWeekEnd)
        expect(result.periodType).toEqual(WEEKLY)
    })

    it('MONTHLY: starts from dataUpdatedThrough and ends at the last day of the previous month', () => {
        const config = {
            periodType: MONTHLY,
            dataUpdatedThrough: '2024-01-01',
        }
        const result = computeFillGapRange(config)
        expect(result.startTime).toEqual('2024-01-01')
        expect(result.endTime).toEqual(lastMonthEnd)
        expect(result.periodType).toEqual(MONTHLY)
    })

    it('YEARLY: starts from the last imported year and ends at last year', () => {
        const config = {
            periodType: YEARLY,
            dataUpdatedThrough: '2022',
        }
        const result = computeFillGapRange(config)
        expect(result.startTime).toEqual('2022')
        expect(result.endTime).toEqual(lastYear)
        expect(result.periodType).toEqual(YEARLY)
    })

    it('caps the end date at the dataset maximum when it is earlier than the last complete period', () => {
        const config = {
            periodType: DAILY,
            dataUpdatedThrough: '2024-01-01',
            dataset: {
                supportedPeriodTypes: [
                    { periodType: DAILY, periodRange: { end: '2024-06-01' } },
                ],
            },
        }
        const result = computeFillGapRange(config)
        expect(result.endTime).toEqual('2024-06-01')
    })

    it('caps the end year at the dataset maximum for YEARLY periods', () => {
        const config = {
            periodType: YEARLY,
            dataUpdatedThrough: '2019',
            dataset: {
                supportedPeriodTypes: [
                    { periodType: YEARLY, periodRange: { end: '2021' } },
                ],
            },
        }
        const result = computeFillGapRange(config)
        expect(result.startTime).toEqual('2019')
        expect(result.endTime).toEqual('2021')
    })

    it('returns null when DAILY data is already up to date (dataUpdatedThrough is today)', () => {
        // start = today, end cap = yesterday — nothing left to import
        const config = {
            periodType: DAILY,
            dataUpdatedThrough: today,
        }
        expect(computeFillGapRange(config)).toBeNull()
    })

    it('returns null when WEEKLY data is already up to date (dataUpdatedThrough is today)', () => {
        const config = {
            periodType: WEEKLY,
            dataUpdatedThrough: today,
        }
        expect(computeFillGapRange(config)).toBeNull()
    })

    it('returns null when MONTHLY data is already up to date (dataUpdatedThrough is today)', () => {
        const config = {
            periodType: MONTHLY,
            dataUpdatedThrough: today,
        }
        expect(computeFillGapRange(config)).toBeNull()
    })

    it('returns null when YEARLY data is already up to date (dataUpdatedThrough is the current year)', () => {
        // end cap is last year, so there is nowhere to import to
        const config = {
            periodType: YEARLY,
            dataUpdatedThrough: currentYear,
        }
        expect(computeFillGapRange(config)).toBeNull()
    })

    it('returns null when dataUpdatedThrough is beyond the dataset maximum', () => {
        const config = {
            periodType: DAILY,
            dataUpdatedThrough: '2024-07-01',
            dataset: {
                supportedPeriodTypes: [
                    { periodType: DAILY, periodRange: { end: '2024-06-01' } },
                ],
            },
        }
        expect(computeFillGapRange(config)).toBeNull()
    })

    describe('calendar-agnostic behaviour', () => {
        // dataUpdatedThrough is always stored as a Gregorian ISO date regardless
        // of the DHIS2 instance calendar. The calendar field on the config has no
        // effect on the computed range — the output is always Gregorian dates.

        it('produces the same DAILY range on a Nepali calendar instance', () => {
            const gregorianResult = computeFillGapRange({
                periodType: DAILY,
                dataUpdatedThrough: '2024-01-15',
            })
            const nepaliResult = computeFillGapRange({
                periodType: DAILY,
                dataUpdatedThrough: '2024-01-15',
                calendar: 'nepali',
            })
            expect(nepaliResult).toEqual(gregorianResult)
        })

        it('produces the same MONTHLY range on an Ethiopic calendar instance', () => {
            const gregorianResult = computeFillGapRange({
                periodType: MONTHLY,
                dataUpdatedThrough: '2024-01-01',
            })
            const ethiopicResult = computeFillGapRange({
                periodType: MONTHLY,
                dataUpdatedThrough: '2024-01-01',
                calendar: 'ethiopic',
            })
            expect(ethiopicResult).toEqual(gregorianResult)
        })

        it('produces the same WEEKLY range on a Nepali calendar instance', () => {
            const gregorianResult = computeFillGapRange({
                periodType: WEEKLY,
                dataUpdatedThrough: '2024-01-07',
            })
            const nepaliResult = computeFillGapRange({
                periodType: WEEKLY,
                dataUpdatedThrough: '2024-01-07',
                calendar: 'nepali',
            })
            expect(nepaliResult).toEqual(gregorianResult)
        })

        it('produces the same YEARLY range on an Ethiopic calendar instance', () => {
            const gregorianResult = computeFillGapRange({
                periodType: YEARLY,
                dataUpdatedThrough: '2022',
            })
            const ethiopicResult = computeFillGapRange({
                periodType: YEARLY,
                dataUpdatedThrough: '2022',
                calendar: 'ethiopic',
            })
            expect(ethiopicResult).toEqual(gregorianResult)
        })
    })
})
