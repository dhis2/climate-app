/**
 * Regression snapshots for every direct use of @dhis2/multi-calendar-dates in
 * the app (through the app's own wrappers in time.js and the
 * createFixedPeriodFromPeriodId call in OpenAsMapButton.jsx).
 *
 * The snapshots were taken against @dhis2/multi-calendar-dates 2.1.2 and are
 * used to verify behaviour after upgrading to 3.x. Calls that throw are
 * recorded as `{ error: message }` instead of being skipped.
 */
import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import {
    DAILY,
    MONTHLY,
    WEEKLY,
    YEARLY,
    fromStandardDate,
    getCalendarDate,
    getDateStringFromIsoDate,
    getDefaultImportPeriod,
    getPeriods,
    toStandardDate,
} from '../time.js'

const capture = (fn) => {
    try {
        return fn()
    } catch (error) {
        return { error: error.message }
    }
}

const CALENDARS = ['gregory', 'ethiopian', 'nepali']

// Mid-month, end of a 31-day month, and a date inside the Ethiopic 13th month
const PINNED_TIMES = [
    '2024-06-15T10:30:00Z',
    '2024-03-31T10:30:00Z',
    '2024-09-08T10:30:00Z',
]

const CALENDAR_DATE_OFFSETS = [
    undefined,
    { days: 0 },
    { days: 1 },
    { days: -1 },
    { months: -1 },
    { months: -6 },
    { months: -12 },
    { years: -1 },
    { years: -2 },
]

const STANDARD_DATES = [
    '2024-01-01',
    '2024-02-29',
    '2024-06-15',
    '2024-09-08',
    '2024-12-31',
]

const CALENDAR_DATES = {
    gregory: ['2024-01-01', '2024-02-29', '2024-12-31'],
    ethiopian: ['2016-01-01', '2016-13-05', '2017-04-30'],
    nepali: ['2081-01-01', '2081-03-32', '2081-12-30'],
}

const PERIOD_RANGES = [
    { periodType: DAILY, startTime: '2024-06-01', endTime: '2024-06-05' },
    // spans the Ethiopic 13th month (Pagume)
    { periodType: DAILY, startTime: '2024-09-04', endTime: '2024-09-13' },
    { periodType: WEEKLY, startTime: '2024-05-01', endTime: '2024-06-30' },
    { periodType: MONTHLY, startTime: '2023-07-01', endTime: '2024-06-30' },
]

const YEARLY_RANGES = {
    gregory: { startTime: 2022, endTime: 2024 },
    ethiopian: { startTime: 2014, endTime: 2016 },
    nepali: { startTime: 2079, endTime: 2081 },
}

const ISO_DATE_STRINGS = ['2024', '2024-06', '2024-06-15', '2024-09-08']

const PERIOD_IDS = {
    gregory: ['2024', '202406', '20240615'],
    ethiopian: ['2016', '201610', '20161007'],
    nepali: ['2081', '208103', '20810301'],
}

afterAll(() => {
    jest.useRealTimers()
})

describe.each(CALENDARS)('%s calendar', (calendar) => {
    describe.each(PINNED_TIMES)('now = %s', (pinnedTime) => {
        beforeEach(() => {
            jest.useFakeTimers()
            jest.setSystemTime(new Date(pinnedTime))
        })

        it('getCalendarDate', () => {
            expect(
                CALENDAR_DATE_OFFSETS.map((offset) => ({
                    offset,
                    result: capture(() => getCalendarDate(calendar, offset)),
                }))
            ).toMatchSnapshot()
        })

        it('getDefaultImportPeriod', () => {
            expect(
                [DAILY, WEEKLY, MONTHLY, YEARLY].map((periodType) =>
                    capture(() =>
                        getDefaultImportPeriod({ calendar, periodType })
                    )
                )
            ).toMatchSnapshot()
        })
    })

    it('fromStandardDate (convertFromIso8601)', () => {
        expect(
            STANDARD_DATES.map((date) => [
                date,
                capture(() => fromStandardDate(date, calendar)),
            ])
        ).toMatchSnapshot()
    })

    it('toStandardDate (convertToIso8601)', () => {
        expect(
            CALENDAR_DATES[calendar].map((date) => [
                date,
                capture(() => toStandardDate(date, calendar)),
            ])
        ).toMatchSnapshot()
    })

    it.each(PERIOD_RANGES)(
        'getPeriods (generateFixedPeriods) $periodType from $startTime to $endTime',
        (range) => {
            expect(
                capture(() => getPeriods({ ...range, calendar, locale: 'en' }))
            ).toMatchSnapshot()
        }
    )

    it('getPeriods (generateFixedPeriods) YEARLY', () => {
        expect(
            capture(() =>
                getPeriods({
                    ...YEARLY_RANGES[calendar],
                    periodType: YEARLY,
                    calendar,
                    locale: 'en',
                })
            )
        ).toMatchSnapshot()
    })

    it('getDateStringFromIsoDate (generateFixedPeriods)', () => {
        const consoleError = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})
        const results = ISO_DATE_STRINGS.map((date) => [
            date,
            capture(() =>
                getDateStringFromIsoDate({ date, calendar, locale: 'en' })
            ),
        ])
        // formatNonGregorianDate swallows errors and logs them; record them
        const loggedErrors = consoleError.mock.calls.map(([, error]) =>
            String(error?.message ?? error)
        )
        consoleError.mockRestore()
        expect({ results, loggedErrors }).toMatchSnapshot()
    })

    it('createFixedPeriodFromPeriodId (OpenAsMapButton)', () => {
        expect(
            PERIOD_IDS[calendar].map((periodId) =>
                capture(() => {
                    const fixedPeriod = createFixedPeriodFromPeriodId({
                        periodId,
                        calendar,
                        locale: 'en',
                    })
                    return {
                        fixedPeriod,
                        // same transformation as OpenAsMapButton
                        periodName: fixedPeriod.name.replaceAll(
                            /\b\w/g,
                            (char) => char.toUpperCase()
                        ),
                    }
                })
            )
        ).toMatchSnapshot()
    })
})
