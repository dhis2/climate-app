import i18n from '@dhis2/d2-i18n'
import { YEARLY, formatStandardDate, getPeriods } from './time.js'

const parseDate = (str) => {
    if (!str) {
        return null
    }
    if (/^\d{4}$/.test(str)) {
        return new Date(parseInt(str, 10), 11, 31)
    }
    return new Date(str)
}

export const autoConfigName = (dataset, orgUnits) => {
    const count = orgUnits?.length ?? 0
    return `${dataset?.name ?? 'Import'} — ${i18n.t('{{count}} org units', {
        count,
        defaultValue: '{{count}} org unit',
        defaultValue_plural: '{{count}} org units',
    })}`
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
        const lastYear = parseInt(dataUpdatedThrough, 10)
        const today = new Date()
        const currentYear = today.getFullYear()
        let endYear = currentYear
        if (datasetMax) {
            endYear = Math.min(endYear, parseInt(datasetMax, 10))
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

    const start = parseDate(dataUpdatedThrough)
    let end = new Date()
    if (datasetMax) {
        const maxEnd = parseDate(datasetMax)
        if (maxEnd && maxEnd < end) {
            end = maxEnd
        }
    }
    if (end < start) {
        return null
    }
    return {
        startTime: formatStandardDate(start),
        endTime: formatStandardDate(end),
        periodType,
    }
}

export const valueCountForRange = ({ orgUnits, periodType, range }) => {
    if (!range || !orgUnits?.length) {
        return 0
    }
    const periods = getPeriods({
        periodType,
        startTime: range.startTime,
        endTime: range.endTime,
        calendar: 'gregory',
    })
    return periods.length * orgUnits.length
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
