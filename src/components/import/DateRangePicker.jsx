import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useCallback, useRef, useState } from 'react'
import useUserLocale from '../../hooks/useUserLocale.js'
import {
    YEARLY,
    getDateStringFromIsoDate,
    normalizeIsoDate,
} from '../../utils/time.js'
import TimeZone from '../shared/TimeZone.jsx'
import classes from './styles/DateRangePicker.module.css'
import YearRange from './YearRange.jsx'

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

    const { startTime, endTime, periodType, calendar } = period

    const matchedPeriodType = dataset?.supportedPeriodTypes?.find(
        (pt) => pt.periodType === periodType
    )
    const periodRange = matchedPeriodType?.periodRange
    const minCalendarDate = normalizeIsoDate(periodRange?.start) || null
    const maxCalendarDate = normalizeIsoDate(periodRange?.end) || null

    const isYearly = periodType === YEARLY
    const datasetFromHourlyData = !!(
        dataset?.timeZone || dataset?.bands?.[0]?.timeZone
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

    const updateStartDate = ({ calendarDateString, validation }) => {
        setStartDateError(validation.valid ? null : validation.validationText)
        onChange({ ...period, startTime: calendarDateString })
    }

    const updateEndDate = ({ calendarDateString, validation }) => {
        setEndDateError(validation.valid ? null : validation.validationText)
        onChange({ ...period, endTime: calendarDateString })
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
            </div>
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
        endTime: PropTypes.string.isRequired,
        periodType: PropTypes.string.isRequired,
        startTime: PropTypes.string.isRequired,
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
