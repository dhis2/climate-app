import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useUserLocale from '../../hooks/useUserLocale.js'
import {
    getCalendarDateBoundaries,
    getCompleteFixedPeriodRange,
    getFixedPeriodForDate,
    getSnappedFixedPeriodRange,
} from '../../utils/fixedPeriodRange.js'
import {
    compareFixedPeriods,
    normalizeDhis2Calendar,
} from '../../utils/periodEngine.js'
import {
    MONTHLY,
    WEEKLY,
    YEARLY,
    getDateStringFromIsoDate,
} from '../../utils/time.js'
import { PeriodRangeField } from '../period-picker/index.js'
import TimeZone from '../shared/TimeZone.jsx'
import classes from './styles/DateRangePicker.module.css'
import YearRange from './YearRange.jsx'

const FIXED_RANGE_PERIOD_TYPES = new Set([WEEKLY, MONTHLY])

const getValidationState = (minDate, maxDate, error) => {
    if (!minDate || !maxDate) {
        return null
    }
    return error === null
}

const DateRangePicker = ({ period, dataset, onChange }) => {
    const { locale: userLocale } = useUserLocale()
    const locale = period.locale || userLocale || 'en'

    const [startDateError, setStartDateError] = useState(null)
    const [endDateError, setEndDateError] = useState(null)

    const { startTime, endTime, periodType } = period
    const calendar = normalizeDhis2Calendar(period.calendar)

    const matchedPeriodType = dataset?.supportedPeriodTypes?.find(
        (pt) => pt.periodType === periodType
    )
    const periodRange = matchedPeriodType?.periodRange
    const {
        minStandardDate,
        maxStandardDate,
        minCalendarDate,
        maxCalendarDate,
    } = useMemo(
        () => getCalendarDateBoundaries({ periodRange, calendar }),
        [calendar, periodRange]
    )

    const isYearly = periodType === YEARLY
    const isFixedRangePeriodType = FIXED_RANGE_PERIOD_TYPES.has(periodType)
    const datasetFromHourlyData = !!(
        dataset?.timeZone || dataset?.bands?.[0]?.timeZone
    )

    const fixedPeriodRange = useMemo(() => {
        if (!isFixedRangePeriodType) {
            return {
                hasCompleteFixedPeriods: true,
                maxPeriod: null,
                maxPeriodId: undefined,
                minPeriod: null,
                minPeriodId: undefined,
            }
        }

        return getCompleteFixedPeriodRange({
            periodRange,
            periodType,
            calendar,
            locale,
        })
    }, [calendar, isFixedRangePeriodType, locale, periodRange, periodType])

    const selectedStartPeriodId = useMemo(
        () =>
            isFixedRangePeriodType
                ? getFixedPeriodForDate({
                      date: startTime,
                      periodType,
                      calendar,
                      locale,
                  })?.id
                : undefined,
        [calendar, isFixedRangePeriodType, locale, periodType, startTime]
    )

    const selectedEndPeriodId = useMemo(
        () =>
            isFixedRangePeriodType
                ? getFixedPeriodForDate({
                      date: endTime,
                      periodType,
                      calendar,
                      locale,
                  })?.id
                : undefined,
        [calendar, endTime, isFixedRangePeriodType, locale, periodType]
    )

    // TimeZone's initialisation effect calls onChange with a functional updater
    // to avoid depending on the period object (which would cause an infinite
    // loop). Resolve it against the latest period via a ref so we don't need
    // period in our own dependency arrays.
    const periodRef = useRef(period)
    periodRef.current = period

    const handleTimeZoneChange = useCallback(
        (updaterOrPeriod) => {
            const updated =
                typeof updaterOrPeriod === 'function'
                    ? updaterOrPeriod(periodRef.current)
                    : updaterOrPeriod
            onChange(updated)
        },
        [onChange]
    )

    useEffect(() => {
        if (
            !isFixedRangePeriodType ||
            !startTime ||
            !endTime ||
            !fixedPeriodRange.hasCompleteFixedPeriods
        ) {
            return
        }

        const snappedRange = getSnappedFixedPeriodRange({
            startTime,
            endTime,
            periodType,
            calendar,
            locale,
            minPeriod: fixedPeriodRange.minPeriod,
            maxPeriod: fixedPeriodRange.maxPeriod,
        })

        if (
            snappedRange &&
            (snappedRange.startTime !== startTime ||
                snappedRange.endTime !== endTime)
        ) {
            onChange({ ...period, ...snappedRange })
        }
    }, [
        calendar,
        endTime,
        fixedPeriodRange,
        isFixedRangePeriodType,
        locale,
        onChange,
        period,
        periodType,
        startTime,
    ])

    const updateStartDate = ({ calendarDateString, validation }) => {
        setStartDateError(validation.valid ? null : validation.validationText)
        onChange({ ...period, startTime: calendarDateString })
    }

    const updateEndDate = ({ calendarDateString, validation }) => {
        setEndDateError(validation.valid ? null : validation.validationText)
        onChange({ ...period, endTime: calendarDateString })
    }

    const updateStartPeriod = (fixedPeriod) => {
        const currentEndPeriod = getFixedPeriodForDate({
            date: endTime,
            periodType,
            calendar,
            locale,
        })
        const endTimeUpdate =
            currentEndPeriod &&
            compareFixedPeriods(fixedPeriod, currentEndPeriod) <= 0
                ? endTime
                : fixedPeriod.endDate

        onChange({
            ...period,
            startTime: fixedPeriod.startDate,
            endTime: endTimeUpdate,
        })
    }

    const updateEndPeriod = (fixedPeriod) => {
        const currentStartPeriod = getFixedPeriodForDate({
            date: startTime,
            periodType,
            calendar,
            locale,
        })
        const startTimeUpdate =
            currentStartPeriod &&
            compareFixedPeriods(currentStartPeriod, fixedPeriod) <= 0
                ? startTime
                : fixedPeriod.startDate

        onChange({
            ...period,
            startTime: startTimeUpdate,
            endTime: fixedPeriod.endDate,
        })
    }

    let errorMessage = null
    if (startDateError && endDateError) {
        errorMessage = i18n.t(
            'Start and end date are not within the valid range.'
        )
    } else if (startDateError) {
        errorMessage = i18n.t('Start date is not within the valid range.')
    } else if (endDateError) {
        errorMessage = i18n.t('End date is not within the valid range.')
    } else if (
        !startDateError &&
        !endDateError &&
        startTime &&
        endTime &&
        startTime > endTime
    ) {
        errorMessage = i18n.t('Start date must be on or before the end date.')
    }

    if (isYearly) {
        return (
            <div className={classes.yearlyContainer}>
                <YearRange
                    period={period}
                    minYear={periodRange?.start ?? '1980'}
                    maxYear={
                        periodRange?.end ?? String(new Date().getFullYear())
                    }
                    onChange={onChange}
                />
                {periodRange && (
                    <div className={classes.validRange}>
                        {i18n.t('Valid range: {{startDate}} – {{endDate}}', {
                            startDate: getDateStringFromIsoDate({
                                date: periodRange.start,
                                calendar,
                                locale,
                            }),
                            endDate: getDateStringFromIsoDate({
                                date: periodRange.end,
                                calendar,
                                locale,
                            }),
                            nsSeparator: ';',
                        })}
                    </div>
                )}
                {errorMessage && (
                    <p className={classes.periodError}>{errorMessage}</p>
                )}
            </div>
        )
    }

    if (isFixedRangePeriodType) {
        return (
            <>
                <div className={classes.pickers}>
                    {fixedPeriodRange.hasCompleteFixedPeriods ? (
                        <PeriodRangeField
                            periodType={periodType}
                            calendar={calendar}
                            locale={locale}
                            fromValue={selectedStartPeriodId}
                            toValue={selectedEndPeriodId}
                            minPeriodId={fixedPeriodRange.minPeriodId}
                            maxPeriodId={fixedPeriodRange.maxPeriodId}
                            fromLabel={i18n.t('Start period')}
                            toLabel={i18n.t('End period')}
                            fromDataTest="start-period-input"
                            toDataTest="end-period-input"
                            onFromChange={updateStartPeriod}
                            onToChange={updateEndPeriod}
                        />
                    ) : (
                        <p className={classes.periodError}>
                            {i18n.t(
                                'No complete periods are available within the valid range.'
                            )}
                        </p>
                    )}
                    {datasetFromHourlyData && (
                        <div className={classes.timezone}>
                            <TimeZone
                                period={period}
                                onChange={handleTimeZoneChange}
                            />
                        </div>
                    )}
                </div>
                {periodRange && (
                    <p className={classes.validRange}>
                        {i18n.t('Valid range')}:{' '}
                        <strong>
                            {getDateStringFromIsoDate({
                                date: minStandardDate || periodRange.start,
                                calendar,
                                locale,
                            })}
                        </strong>
                        {' – '}
                        <strong>
                            {getDateStringFromIsoDate({
                                date: maxStandardDate || periodRange.end,
                                calendar,
                                locale,
                            })}
                        </strong>
                    </p>
                )}
                {errorMessage && (
                    <p className={classes.periodError}>{errorMessage}</p>
                )}
            </>
        )
    }

    return (
        <>
            <div className={classes.pickers}>
                <CalendarInput
                    label={i18n.t('Start date')}
                    date={startTime}
                    minDate={minCalendarDate}
                    maxDate={maxCalendarDate}
                    calendar={calendar}
                    locale={locale}
                    onDateSelect={updateStartDate}
                    warning={!!startDateError}
                    valid={getValidationState(
                        minCalendarDate,
                        maxCalendarDate,
                        startDateError
                    )}
                    dataTest="start-date-input"
                />
                <span className={classes.separator}>{'–'}</span>
                <CalendarInput
                    label={i18n.t('End date')}
                    date={endTime}
                    minDate={minCalendarDate}
                    maxDate={maxCalendarDate}
                    calendar={calendar}
                    locale={locale}
                    onDateSelect={updateEndDate}
                    warning={!!endDateError}
                    valid={getValidationState(
                        minCalendarDate,
                        maxCalendarDate,
                        endDateError
                    )}
                    dataTest="end-date-input"
                />
                {datasetFromHourlyData && (
                    <div className={classes.timezone}>
                        <TimeZone
                            period={period}
                            onChange={handleTimeZoneChange}
                        />
                    </div>
                )}
            </div>
            {periodRange && (
                <p className={classes.validRange}>
                    {i18n.t('Valid range')}:{' '}
                    <strong>
                        {getDateStringFromIsoDate({
                            date: periodRange.start,
                            calendar,
                            locale,
                        })}
                    </strong>
                    {' – '}
                    <strong>
                        {getDateStringFromIsoDate({
                            date: periodRange.end,
                            calendar,
                            locale,
                        })}
                    </strong>
                </p>
            )}
            {errorMessage && (
                <p className={classes.periodError}>{errorMessage}</p>
            )}
        </>
    )
}

DateRangePicker.propTypes = {
    period: PropTypes.shape({
        calendar: PropTypes.string.isRequired,
        endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        periodType: PropTypes.string.isRequired,
        startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        locale: PropTypes.string,
        timeZone: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    dataset: PropTypes.shape({
        bands: PropTypes.array,
        supportedPeriodTypes: PropTypes.array,
        timeZone: PropTypes.object,
    }),
}

export default DateRangePicker
