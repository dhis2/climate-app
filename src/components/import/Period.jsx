import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import useSystemInfo from '../../hooks/useSystemInfo.js'
import useUserLocale from '../../hooks/useUserLocale.js'
import {
    YEARLY,
    WEEKLY,
    MONTHLY,
    normalizeIsoDate,
    getDateStringFromIsoDate,
    getPeriodTypes,
    UTC_TIME_ZONE,
} from '../../utils/time.js'
import SectionH2 from '../shared/SectionH2.jsx'
import TimeZone from '../shared/TimeZone.jsx'
import HelpfulInfo from './HelpfulInfo.jsx'
import PeriodType from './PeriodType.jsx'
import classes from './styles/Period.module.css'
import YearRange from './YearRange.jsx'

const DEFAULT_DATASET = {}

const getDateRangeErrorMessage = ({ startDateError, endDateError }) => {
    let periodErrorMessage = null
    if (startDateError && endDateError) {
        periodErrorMessage = i18n.t(
            'Start and end date are not within the valid range.'
        )
    } else if (startDateError) {
        periodErrorMessage = i18n.t('Start date is not within the valid range.')
    } else if (endDateError) {
        periodErrorMessage = i18n.t('End date is not within the valid range.')
    }
    return periodErrorMessage
}

const getValidationState = (minCalendarDate, maxCalendarDate, dateError) => {
    if (!minCalendarDate || !maxCalendarDate) {
        return null
    }
    return dateError === null
}

const Period = ({
    period,
    dataset = DEFAULT_DATASET,
    onChange,
    onChangeType,
}) => {
    const { locale } = useUserLocale()
    const { system } = useSystemInfo()

    const timeZone = system?.systemInfo?.serverTimeZoneId

    // Set period locale from user settings
    useEffect(() => {
        if (locale && locale !== period.locale) {
            onChange({ ...period, locale })
        }
    }, [locale, onChange, period])

    // When switching from yearly to other period types
    // convert start/end years to dates
    useEffect(() => {
        if (period?.periodType !== YEARLY && period?.startTime.length === 4) {
            const startTime = period.startTime + '-01-01'
            const endTime = period.endTime + '-12-31'
            onChange({ ...period, startTime, endTime })
        }
    }, [onChange, period])

    // Clear date errors when dataset changes
    useEffect(() => {
        setStartDateError(null)
        setEndDateError(null)
    }, [dataset])

    const [startDateError, setStartDateError] = useState(null)
    const [endDateError, setEndDateError] = useState(null)

    const {
        supportedPeriodTypes: datasetSupportedPeriodTypes,
        period: datasetPeriod,
    } = dataset
    const { periodType, startTime, endTime, calendar } = period

    // Find the supported period type object that matches the current periodType
    const matchedPeriodTypeObj = datasetSupportedPeriodTypes?.find(
        (pt) => pt.periodType === periodType
    )
    const datasetPeriodType = matchedPeriodTypeObj?.periodType
    const datasetPeriodRange = matchedPeriodTypeObj?.periodRange

    const minCalendarDate = normalizeIsoDate(datasetPeriodRange?.start) || null
    const maxCalendarDate = normalizeIsoDate(datasetPeriodRange?.end) || null

    const updateStartDate = ({ calendarDateString, validation }) => {
        setStartDateError(validation.valid ? null : validation.validationText)
        onChange({
            ...period,
            startTime: calendarDateString,
        })
    }

    const updateEndDate = ({ calendarDateString, validation }) => {
        setEndDateError(validation.valid ? null : validation.validationText)
        onChange({
            ...period,
            endTime: calendarDateString,
        })
    }

    const isYearly = datasetPeriodType === YEARLY

    const periodErrorMessage = getDateRangeErrorMessage({
        startDateError,
        endDateError,
    })

    const periodTypeName = getPeriodTypes().find(
        (pt) => pt.id === periodType
    )?.name

    const datasetFromHourlyData = !!(
        dataset.timeZone || dataset.bands?.[0]?.timeZone
    )

    const getHelpText = () => {
        let helpText = ''

        if (datasetFromHourlyData) {
            // Has timezone - data aggregated from hourly data
            if (periodType === WEEKLY) {
                helpText = i18n.t(
                    'Weekly data for full calendar weeks inclusive of start and end dates will be aggregated from hourly data.'
                )
            } else if (periodType === MONTHLY) {
                helpText = i18n.t(
                    'Monthly data for full calendar months inclusive of start and end dates will be aggregated from hourly data.'
                )
            } else {
                helpText = i18n.t(
                    '{{periodTypeName}} data between start and end date will be aggregated from hourly data.',
                    { periodTypeName }
                )
            }

            // Add timezone adjustment note if not UTC
            if (timeZone !== UTC_TIME_ZONE) {
                helpText +=
                    ' ' +
                    i18n.t(
                        'Time zone adjustments will be applied if the selected time zone is not set to UTC.'
                    )
            }
        } else {
            if (periodType === WEEKLY) {
                helpText = i18n.t(
                    'Data for full calendar weeks inclusive of start and end dates will be aggregated to weekly values.'
                )
            } else if (periodType === MONTHLY) {
                helpText = i18n.t(
                    'Data for full calendar months inclusive of start and end dates will be aggregated to monthly values.'
                )
            } else {
                helpText = i18n.t(
                    'Data between start and end date will be imported as daily values.'
                )
            }
        }
        return helpText
    }

    if (datasetPeriod) {
        return (
            <>
                <SectionH2 number="2" title="Configure period" />
                <p>
                    {i18n.t(
                        'The data will be assigned a yearly period type that matches the year it was collected: {{datasetPeriod}}',
                        { datasetPeriod, nsSeparator: ';' }
                    )}
                </p>
            </>
        )
    }

    return (
        <>
            <SectionH2 number="2" title="Configure period" />
            {isYearly ? (
                <div className={classes.yearlyContainer}>
                    <PeriodType
                        periodType={periodType}
                        supportedPeriodTypes={datasetSupportedPeriodTypes}
                        onChange={onChangeType}
                    />
                    <YearRange
                        period={period}
                        minYear={datasetPeriodRange?.start}
                        maxYear={datasetPeriodRange?.end}
                        onChange={onChange}
                    />
                    {datasetPeriodRange && (
                        <div className={classes.yearlyValidRange}>
                            {i18n.t(
                                'Valid range: {{startDate}} - {{endDate}}',
                                {
                                    startDate: getDateStringFromIsoDate({
                                        date: datasetPeriodRange.start,
                                        calendar,
                                        locale: period.locale,
                                    }),
                                    endDate: getDateStringFromIsoDate({
                                        date: datasetPeriodRange.end,
                                        calendar,
                                        locale: period.locale,
                                    }),
                                    nsSeparator: ';',
                                }
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <PeriodType
                        periodType={periodType}
                        supportedPeriodTypes={datasetSupportedPeriodTypes}
                        onChange={onChangeType}
                    />
                    <div className={classes.pickers}>
                        <CalendarInput
                            label={i18n.t('Start date')}
                            date={startTime}
                            minDate={minCalendarDate}
                            maxDate={maxCalendarDate}
                            calendar={calendar}
                            locale={locale || 'en'}
                            onDateSelect={updateStartDate}
                            warning={!!startDateError}
                            valid={getValidationState(
                                minCalendarDate,
                                maxCalendarDate,
                                startDateError
                            )}
                            dataTest="start-date-input"
                        />
                        <span className={classes.separator}>—</span>
                        <CalendarInput
                            label={i18n.t('End date')}
                            date={endTime}
                            minDate={minCalendarDate}
                            maxDate={maxCalendarDate}
                            calendar={calendar}
                            locale={locale || 'en'}
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
                                <TimeZone period={period} onChange={onChange} />
                            </div>
                        )}
                    </div>
                    {datasetPeriodRange && (
                        <p>
                            {i18n.t('Valid range')}:{' '}
                            <strong>
                                {getDateStringFromIsoDate({
                                    date: datasetPeriodRange.start,
                                    calendar,
                                    locale: period.locale,
                                })}
                            </strong>{' '}
                            -{' '}
                            <strong>
                                {getDateStringFromIsoDate({
                                    date: datasetPeriodRange.end,
                                    calendar,
                                    locale: period.locale,
                                })}
                            </strong>
                        </p>
                    )}

                    <HelpfulInfo text={getHelpText} />
                </>
            )}

            {periodErrorMessage && (
                <p className={classes.periodError}>{periodErrorMessage}</p>
            )}
        </>
    )
}

Period.propTypes = {
    period: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeType: PropTypes.func.isRequired,
    dataset: PropTypes.object,
}

export default Period
