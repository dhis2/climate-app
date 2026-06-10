import i18n from '@dhis2/d2-i18n'
import {
    DAILY,
    MONTHLY,
    WEEKLY,
    YEARLY,
    formatStandardDate,
    getPeriods,
    oneDayInMs,
} from './time.js'

const parseDate = (str) => {
    if (!str) {
        return null
    }
    if (/^\d{4}$/.test(str)) {
        return new Date(Number.parseInt(str, 10), 11, 31)
    }
    return new Date(str)
}

export const autoConfigName = (dataset, featureCount = 0) => {
    return `${dataset?.name ?? 'Import'} — ${i18n.t('{{count}} org units', {
        count: featureCount,
        defaultValue: '{{count}} org unit',
        defaultValue_plural: '{{count}} org units',
    })}`
}

const getDefaultEndDate = (periodType, now) => {
    if (periodType === DAILY) {
        return new Date(now.getTime() - oneDayInMs)
    }
    if (periodType === MONTHLY) {
        return new Date(now.getFullYear(), now.getMonth(), 0)
    }
    if (periodType === WEEKLY) {
        const daysToLastSunday = now.getDay() || 7
        return new Date(now.getTime() - daysToLastSunday * oneDayInMs)
    }
    return new Date(now)
}

export const computeFillGapRange = (config) => {
    if (!config?.dataUpdatedThrough) {
        return null
    }
    const { periodType, dataUpdatedThrough, dataset } = config
    const datasetMax = dataset?.supportedPeriodTypes?.find(
        (pt) => pt.periodType === periodType
    )?.periodRange?.end

    if (periodType === YEARLY) {
        const lastYear = Number.parseInt(dataUpdatedThrough, 10)
        const now = new Date()
        let endYear = now.getFullYear() - 1
        if (datasetMax) {
            endYear = Math.min(endYear, Number.parseInt(datasetMax, 10))
        }
        if (endYear < lastYear) {
            return null
        }
        return {
            startTime: String(lastYear),
            endTime: String(endYear),
            periodType,
        }
    }

    const now = new Date()
    let end = getDefaultEndDate(periodType, now)

    if (datasetMax) {
        const maxEnd = parseDate(datasetMax)
        if (maxEnd && maxEnd < end) {
            end = maxEnd
        }
    }

    const start = parseDate(dataUpdatedThrough)
    if (end < start) {
        return null
    }
    return {
        startTime: formatStandardDate(start),
        endTime: formatStandardDate(end),
        periodType,
    }
}

export const valueCountForRange = ({ featureCount, periodType, range }) => {
    if (!range || !featureCount) {
        return 0
    }
    const periods = getPeriods({
        periodType,
        startTime: range.startTime,
        endTime: range.endTime,
        calendar: 'gregory',
    })
    return periods.length * featureCount
}

export const formatBookmarkDate = (str) => {
    if (!str) {
        return ''
    }
    if (/^\d{4}$/.test(str)) {
        return str
    }
    const d = new Date(str)
    if (Number.isNaN(d.getTime())) {
        return str
    }
    return d.toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export const formatRelativeTime = (isoString) => {
    if (!isoString) {
        return ''
    }
    const then = new Date(isoString)
    if (Number.isNaN(then.getTime())) {
        return ''
    }
    const diffSec = Math.floor((Date.now() - then.getTime()) / 1000)
    if (diffSec < 60) {
        return i18n.t('just now')
    }
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) {
        return i18n.t('{{count}} minutes ago', {
            count: diffMin,
            defaultValue: '{{count}} minute ago',
            defaultValue_plural: '{{count}} minutes ago',
        })
    }
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) {
        return i18n.t('{{count}} hours ago', {
            count: diffHr,
            defaultValue: '{{count}} hour ago',
            defaultValue_plural: '{{count}} hours ago',
        })
    }
    const diffDay = Math.floor(diffHr / 24)
    if (diffDay < 30) {
        return i18n.t('{{count}} days ago', {
            count: diffDay,
            defaultValue: '{{count}} day ago',
            defaultValue_plural: '{{count}} days ago',
        })
    }
    const diffMonth = Math.floor(diffDay / 30)
    if (diffMonth < 12) {
        return i18n.t('{{count}} months ago', {
            count: diffMonth,
            defaultValue: '{{count}} month ago',
            defaultValue_plural: '{{count}} months ago',
        })
    }
    const diffYear = Math.floor(diffMonth / 12)
    return i18n.t('{{count}} years ago', {
        count: diffYear,
        defaultValue: '{{count}} year ago',
        defaultValue_plural: '{{count}} years ago',
    })
}
