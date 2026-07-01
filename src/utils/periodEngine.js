import {
    getAdjacentFixedPeriods as getAdjacentFixedPeriodsFromLibrary,
    createFixedPeriodFromPeriodId as createFixedPeriodFromPeriodIdFromLibrary,
    generateFixedPeriods as generateFixedPeriodsFromLibrary,
    getFixedPeriodByDate as getFixedPeriodByDateFromLibrary,
    getNowInCalendar,
} from '@dhis2/multi-calendar-dates'

export const DEFAULT_DHIS2_CALENDAR = 'gregory'
export const DEFAULT_DHIS2_LOCALE = 'en'
export const DEFAULT_DHIS2_TIME_ZONE = 'Etc/UTC'

export const WEEKLY = 'WEEKLY'
export const MONTHLY = 'MONTHLY'

const DHIS2_CALENDAR_MAP = {
    buddhist: 'buddhist',
    coptic: 'coptic',
    ethiopian: 'ethiopic',
    ethiopic: 'ethiopic',
    gregorian: 'gregory',
    gregory: 'gregory',
    islamic: 'islamic',
    iso8601: 'iso8601',
    nepali: 'nepali',
    persian: 'persian',
    thai: 'buddhist',
}

const stripLeadingZeroes = (value) => value.replace(/^0+(?=\d)/, '')

const padWithZeroes = (value) => String(value).padStart(2, '0')

export const normalizeDhis2Calendar = (calendar = DEFAULT_DHIS2_CALENDAR) => {
    if (!calendar) {
        return DEFAULT_DHIS2_CALENDAR
    }

    const normalizedCalendar = String(calendar).toLowerCase()
    return DHIS2_CALENDAR_MAP[normalizedCalendar] || calendar
}

export const canonicalizePeriodId = (periodId) => {
    const trimmedPeriodId = String(periodId ?? '').trim()
    const weeklyMatch = trimmedPeriodId.match(
        /^(\d{4})([A-Z][a-z]{2})?W0*(\d+)$/
    )

    if (weeklyMatch) {
        const [, year, offset = '', week] = weeklyMatch
        return `${year}${offset}W${stripLeadingZeroes(week)}`
    }

    const biWeeklyMatch = trimmedPeriodId.match(/^(\d{4})BiW0*(\d+)$/)

    if (biWeeklyMatch) {
        const [, year, week] = biWeeklyMatch
        return `${year}BiW${stripLeadingZeroes(week)}`
    }

    return trimmedPeriodId
}

export const isSupportedFixedPeriodType = (periodType) =>
    periodType === WEEKLY || periodType === MONTHLY

const assertSupportedFixedPeriodType = (periodType) => {
    if (!isSupportedFixedPeriodType(periodType)) {
        throw new Error(`Unsupported DHIS2 period type "${periodType}"`)
    }
}

export const generateFixedPeriods = ({
    year,
    periodType,
    calendar,
    locale = DEFAULT_DHIS2_LOCALE,
}) => {
    assertSupportedFixedPeriodType(periodType)

    return generateFixedPeriodsFromLibrary({
        year,
        periodType,
        calendar: normalizeDhis2Calendar(calendar),
        locale,
    })
}

export const createFixedPeriodFromPeriodId = ({
    periodId,
    calendar,
    locale = DEFAULT_DHIS2_LOCALE,
}) =>
    createFixedPeriodFromPeriodIdFromLibrary({
        periodId: canonicalizePeriodId(periodId),
        calendar: normalizeDhis2Calendar(calendar),
        locale,
    })

export const getFixedPeriodByDate = ({
    periodType,
    date,
    calendar,
    locale = DEFAULT_DHIS2_LOCALE,
}) => {
    assertSupportedFixedPeriodType(periodType)

    return getFixedPeriodByDateFromLibrary({
        periodType,
        date,
        calendar: normalizeDhis2Calendar(calendar),
        locale,
    })
}

export const getAdjacentFixedPeriod = ({
    period,
    steps,
    calendar,
    locale = DEFAULT_DHIS2_LOCALE,
}) =>
    getAdjacentFixedPeriodsFromLibrary({
        period,
        steps,
        calendar: normalizeDhis2Calendar(calendar),
        locale,
    })[0]

export const getTodayInCalendar = ({
    calendar,
    timeZone = DEFAULT_DHIS2_TIME_ZONE,
}) => {
    const now = getNowInCalendar(normalizeDhis2Calendar(calendar), timeZone)
    const year = now.eraYear ?? now.year

    return `${year}-${padWithZeroes(now.month)}-${padWithZeroes(now.day)}`
}

export const compareFixedPeriods = (a, b) => {
    const startDateComparison = a.startDate.localeCompare(b.startDate)

    if (startDateComparison !== 0) {
        return startDateComparison
    }

    const endDateComparison = a.endDate.localeCompare(b.endDate)

    if (endDateComparison !== 0) {
        return endDateComparison
    }

    return a.id.localeCompare(b.id)
}
