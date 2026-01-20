import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import useSystemInfo from '../../hooks/useSystemInfo.js'
import useUserLocale from '../../hooks/useUserLocale.js'
import {
    YEARLY,
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

const getValidationState = (minCalendarDate, maxCalendarDate, dateError) => {
    if (!minCalendarDate || !maxCalendarDate) {
        return null
    }
    return dateError === null
}

const Period = ({ period, dataset = DEFAULT_DATASET, onChange }) => {
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

    const periodTypeName = getPeriodTypes().find(
        (pt) => pt.id === periodType
    )?.name

    let helpText
    if (dataset.timeZone || dataset.bands?.[0]?.timeZone) {
        if (timeZone !== UTC_TIME_ZONE) {
            helpText = i18n.t(
                '{{periodTypeName}} data between start and end date will be calculated from hourly data, with time zone adjustments applied if the selected time zone is not set to UTC.',
                { periodTypeName, nsSeparator: ';' }
            )
        } else {
            helpText = i18n.t(
                '{{periodTypeName}} data between start and end date will be calculated from hourly data.',
                { periodTypeName, nsSeparator: ';' }
            )
        }
    } else {
        helpText = i18n.t(
            '{{periodTypeName}} data between start and end date will be calculated and then aggregated to the selected period type.',
            { periodTypeName, nsSeparator: ';' }
        )
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
                        onChange={(periodType) =>
                            onChange({ ...period, periodType })
                        }
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
                        onChange={(periodType) =>
                            onChange({ ...period, periodType })
                        }
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
                        {(dataset.timeZone || dataset.bands?.[0]?.timeZone) && (
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

                    <HelpfulInfo text={helpText} />
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
    dataset: PropTypes.object,
}

export default Period
