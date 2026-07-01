import i18n from '@dhis2/d2-i18n'
import { Label } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import {
    MONTHLY,
    WEEKLY,
    compareFixedPeriods,
    createFixedPeriodFromPeriodId,
    normalizeDhis2Calendar,
} from '../../utils/periodEngine.js'
import { PeriodPicker } from './PeriodPicker.jsx'
import styles from './PeriodRangeField.module.css'

const getPeriod = ({ periodId, calendar, locale }) =>
    periodId ? createPeriodSafely({ periodId, calendar, locale }) : undefined

const createPeriodSafely = (options) => {
    try {
        return createFixedPeriodFromPeriodId(options)
    } catch {
        return undefined
    }
}

const getRangeError = ({ fromPeriod, toPeriod, fallbackError, enabled }) => {
    if (fallbackError || !enabled || !fromPeriod || !toPeriod) {
        return fallbackError
    }

    if (compareFixedPeriods(fromPeriod, toPeriod) > 0) {
        return i18n.t('Start period must be before or equal to end period.')
    }

    return null
}

export const PeriodRangeField = ({
    periodType,
    calendar,
    locale = 'en',
    fromValue,
    toValue,
    minPeriodId,
    maxPeriodId,
    disabled,
    error,
    fromLabel = i18n.t('From period'),
    toLabel = i18n.t('To period'),
    fromError,
    toError,
    fromDataTest,
    toDataTest,
    onFromChange,
    onToChange,
}) => {
    const normalizedCalendar = normalizeDhis2Calendar(calendar)
    const fromPeriod = useMemo(
        () =>
            getPeriod({
                periodId: fromValue,
                calendar: normalizedCalendar,
                locale,
            }),
        [fromValue, locale, normalizedCalendar]
    )
    const toPeriod = useMemo(
        () =>
            getPeriod({
                periodId: toValue,
                calendar: normalizedCalendar,
                locale,
            }),
        [toValue, locale, normalizedCalendar]
    )
    const invalidRange = Boolean(
        fromPeriod && toPeriod && compareFixedPeriods(fromPeriod, toPeriod) > 0
    )
    const resolvedFromError = getRangeError({
        fromPeriod,
        toPeriod,
        fallbackError: fromError,
        enabled: error,
    })
    const resolvedToError = getRangeError({
        fromPeriod,
        toPeriod,
        fallbackError: toError,
        enabled: error,
    })

    return (
        <div className={styles.container}>
            <div className={styles.field}>
                <Label>{fromLabel}</Label>
                <PeriodPicker
                    value={fromValue}
                    periodType={periodType}
                    calendar={normalizedCalendar}
                    locale={locale}
                    minPeriodId={minPeriodId}
                    maxPeriodId={maxPeriodId}
                    referencePeriodId={toValue}
                    disabled={disabled}
                    error={Boolean(resolvedFromError || invalidRange)}
                    dataTest={fromDataTest}
                    ariaLabel={fromLabel}
                    isPeriodDisabled={(period) =>
                        toPeriod
                            ? compareFixedPeriods(period, toPeriod) > 0
                            : false
                    }
                    onChange={onFromChange}
                />
                {resolvedFromError && (
                    <p className={styles.errorText}>{resolvedFromError}</p>
                )}
            </div>

            <div className={styles.field}>
                <Label>{toLabel}</Label>
                <PeriodPicker
                    value={toValue}
                    periodType={periodType}
                    calendar={normalizedCalendar}
                    locale={locale}
                    minPeriodId={minPeriodId}
                    maxPeriodId={maxPeriodId}
                    referencePeriodId={fromValue}
                    disabled={disabled}
                    error={Boolean(resolvedToError || invalidRange)}
                    dataTest={toDataTest}
                    ariaLabel={toLabel}
                    isPeriodDisabled={(period) =>
                        fromPeriod
                            ? compareFixedPeriods(period, fromPeriod) < 0
                            : false
                    }
                    onChange={onToChange}
                />
                {resolvedToError && (
                    <p className={styles.errorText}>{resolvedToError}</p>
                )}
            </div>
        </div>
    )
}

PeriodRangeField.propTypes = {
    calendar: PropTypes.string.isRequired,
    periodType: PropTypes.oneOf([WEEKLY, MONTHLY]).isRequired,
    onFromChange: PropTypes.func.isRequired,
    onToChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    fromDataTest: PropTypes.string,
    fromError: PropTypes.string,
    fromLabel: PropTypes.string,
    fromValue: PropTypes.string,
    locale: PropTypes.string,
    maxPeriodId: PropTypes.string,
    minPeriodId: PropTypes.string,
    toDataTest: PropTypes.string,
    toError: PropTypes.string,
    toLabel: PropTypes.string,
    toValue: PropTypes.string,
}

export default PeriodRangeField
