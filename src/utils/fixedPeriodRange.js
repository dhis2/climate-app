import {
    compareFixedPeriods,
    getAdjacentFixedPeriod,
    getFixedPeriodByDate,
} from './periodEngine.js'
import { fromStandardDate } from './time.js'

const getIsoWeekStartDate = (year, week) => {
    const simple = new Date(Date.UTC(year, 0, 4))
    const dayOfWeek = simple.getUTCDay() || 7
    const isoWeek1Start = new Date(simple)
    isoWeek1Start.setUTCDate(simple.getUTCDate() - dayOfWeek + 1)

    const date = new Date(isoWeek1Start)
    date.setUTCDate(date.getUTCDate() + (week - 1) * 7)
    return date
}

export const normalizeStandardDateBoundary = (input, boundary) => {
    if (!input || typeof input !== 'string') {
        return null
    }

    if (/^\d{4}$/.test(input)) {
        return boundary === 'end' ? `${input}-12-31` : `${input}-01-01`
    }

    const monthMatch = /^(\d{4})-(\d{2})$/.exec(input)
    if (monthMatch) {
        const [, year, month] = monthMatch
        if (boundary === 'end') {
            return new Date(Date.UTC(Number(year), Number(month), 0))
                .toISOString()
                .slice(0, 10)
        }
        return `${input}-01`
    }

    const weekMatch = /^(\d{4})-?W0?(\d{1,2})$/.exec(input)
    if (weekMatch) {
        const [, yearStr, weekStr] = weekMatch
        const date = getIsoWeekStartDate(
            Number.parseInt(yearStr, 10),
            Number.parseInt(weekStr, 10)
        )

        if (boundary === 'end') {
            date.setUTCDate(date.getUTCDate() + 6)
        }

        return date.toISOString().slice(0, 10)
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return input
    }

    return null
}

const toCalendarDate = (standardDate, calendar) => {
    if (!standardDate) {
        return null
    }

    try {
        return fromStandardDate(standardDate, calendar)
    } catch {
        return null
    }
}

export const getCalendarDateBoundaries = ({ periodRange, calendar }) => {
    const minStandardDate = normalizeStandardDateBoundary(
        periodRange?.start,
        'start'
    )
    const maxStandardDate = normalizeStandardDateBoundary(
        periodRange?.end,
        'end'
    )

    return {
        minStandardDate,
        maxStandardDate,
        minCalendarDate: toCalendarDate(minStandardDate, calendar),
        maxCalendarDate: toCalendarDate(maxStandardDate, calendar),
    }
}

export const getFixedPeriodForDate = ({
    date,
    periodType,
    calendar,
    locale,
}) => {
    try {
        return getFixedPeriodByDate({
            periodType,
            date,
            calendar,
            locale,
        })
    } catch {
        return null
    }
}

const getFirstFullPeriodOnOrAfter = ({
    date,
    periodType,
    calendar,
    locale,
}) => {
    const period = getFixedPeriodForDate({
        date,
        periodType,
        calendar,
        locale,
    })

    if (!period) {
        return null
    }

    return period.startDate < date
        ? getAdjacentFixedPeriod({ period, steps: 1, calendar, locale })
        : period
}

const getLastFullPeriodOnOrBefore = ({
    date,
    periodType,
    calendar,
    locale,
}) => {
    const period = getFixedPeriodForDate({
        date,
        periodType,
        calendar,
        locale,
    })

    if (!period) {
        return null
    }

    return period.endDate > date
        ? getAdjacentFixedPeriod({ period, steps: -1, calendar, locale })
        : period
}

export const getCompleteFixedPeriodRange = ({
    periodRange,
    periodType,
    calendar,
    locale,
}) => {
    const {
        minStandardDate,
        maxStandardDate,
        minCalendarDate,
        maxCalendarDate,
    } = getCalendarDateBoundaries({ periodRange, calendar })

    const minPeriod = minCalendarDate
        ? getFirstFullPeriodOnOrAfter({
              date: minCalendarDate,
              periodType,
              calendar,
              locale,
          })
        : null
    const maxPeriod = maxCalendarDate
        ? getLastFullPeriodOnOrBefore({
              date: maxCalendarDate,
              periodType,
              calendar,
              locale,
          })
        : null

    const hasCompleteFixedPeriods = Boolean(
        (!minCalendarDate || minPeriod) &&
            (!maxCalendarDate || maxPeriod) &&
            (!minPeriod ||
                !maxPeriod ||
                compareFixedPeriods(minPeriod, maxPeriod) <= 0)
    )

    return {
        hasCompleteFixedPeriods,
        maxCalendarDate,
        maxPeriod,
        maxPeriodId: maxPeriod?.id,
        maxStandardDate,
        minCalendarDate,
        minPeriod,
        minPeriodId: minPeriod?.id,
        minStandardDate,
    }
}

const clampFixedPeriod = ({ period, minPeriod, maxPeriod }) => {
    if (minPeriod && compareFixedPeriods(period, minPeriod) < 0) {
        return minPeriod
    }

    if (maxPeriod && compareFixedPeriods(period, maxPeriod) > 0) {
        return maxPeriod
    }

    return period
}

export const getSnappedFixedPeriodRange = ({
    startTime,
    endTime,
    periodType,
    calendar,
    locale,
    minPeriod,
    maxPeriod,
}) => {
    const startPeriod = getFixedPeriodForDate({
        date: startTime,
        periodType,
        calendar,
        locale,
    })
    const endPeriod = getFixedPeriodForDate({
        date: endTime,
        periodType,
        calendar,
        locale,
    })

    if (!startPeriod || !endPeriod) {
        return null
    }

    const snappedStartPeriod = clampFixedPeriod({
        period: startPeriod,
        minPeriod,
        maxPeriod,
    })
    let snappedEndPeriod = clampFixedPeriod({
        period: endPeriod,
        minPeriod,
        maxPeriod,
    })

    if (compareFixedPeriods(snappedStartPeriod, snappedEndPeriod) > 0) {
        snappedEndPeriod = snappedStartPeriod
    }

    return {
        startTime: snappedStartPeriod.startDate,
        endTime: snappedEndPeriod.endDate,
    }
}
