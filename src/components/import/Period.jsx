import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import {
    YEARLY,
    normalizeIsoDate,
    getDateStringFromIsoDate,
} from '../../utils/time.js'
import SectionH2 from '../shared/SectionH2.jsx'
import TimeZone from '../shared/TimeZone.jsx'
import HelpfulInfo from './HelpfulInfo.jsx'
import PeriodType from './PeriodType.jsx'
import styles from './styles/Period.module.css'
import YearRange from './YearRange.jsx'

const userSettingsQuery = {
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale'],
        },
    },
}

const DEFAULT_DATASET = {}

const Period = ({ period, dataset = DEFAULT_DATASET, onChange }) => {
    const result = useDataQuery(userSettingsQuery)
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } = result

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
        periodType: datasetPeriodType,
        supportedPeriodTypes: datasetSupportedPeriodTypes,
        periodRange: datasetPeriodRange,
        period: datasetPeriod,
    } = dataset
    const { periodType, startTime, endTime, calendar } = period

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

    const hasNoPeriod = datasetPeriodType === 'N/A'
    const isYearly = datasetPeriodType === YEARLY

    const periodErrorMessage =
        startDateError && endDateError
            ? i18n.t('Start and end date are not within the valid range.')
            : startDateError
            ? i18n.t('Start date is not within the valid range.')
            : endDateError
            ? i18n.t('End date is not within the valid range.')
            : null

    return (
        <div className={styles.container}>
            {hasNoPeriod && (
                <p>
                    {i18n.t(
                        'The data will be assigned a default yearly period that matches the year it was collected: {{datasetPeriod}}',
                        { datasetPeriod, nsSeparator: ';' }
                    )}
                </p>
            )}
            {isYearly && (
                <>
                    <SectionH2 number="2" title="Configure period" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.pickers}>
                            <YearRange
                                period={period}
                                minYear={datasetPeriodRange.start}
                                maxYear={datasetPeriodRange.end}
                                onChange={onChange}
                            />
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
                        <PeriodType
                            periodType={periodType}
                            supportedPeriodTypes={datasetSupportedPeriodTypes}
                            onChange={(periodType) =>
                                onChange({ ...period, periodType })
                            }
                        />
                    </div>
                </>
            )}
            {!hasNoPeriod && !isYearly && (
                <>
                    <SectionH2 number="2" title="Configure period" />
                    <div className={styles.pickers}>
                        <CalendarInput
                            label={i18n.t('Start date')}
                            date={startTime}
                            minDate={minCalendarDate}
                            maxDate={maxCalendarDate}
                            calendar={calendar}
                            locale={locale || 'en'}
                            onDateSelect={updateStartDate}
                            warning={!!startDateError}
                            valid={!startDateError}
                        />
                        <CalendarInput
                            label={i18n.t('End date')}
                            date={endTime}
                            minDate={minCalendarDate}
                            maxDate={maxCalendarDate}
                            calendar={calendar}
                            locale={locale || 'en'}
                            onDateSelect={updateEndDate}
                            warning={!!endDateError}
                            valid={!endDateError}
                        />
                        <TimeZone period={period} onChange={onChange} />
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
                    <PeriodType
                        periodType={periodType}
                        supportedPeriodTypes={datasetSupportedPeriodTypes}
                        onChange={(periodType) =>
                            onChange({ ...period, periodType })
                        }
                    />
                    <HelpfulInfo
                        text={i18n.t(
                            'Daily data between start and end date will be calculated, and aggregated in DHIS2 to the selected period aggregation level. If the DHIS2 instance time zone is not UTC, then it is possible to choose the instance time zone or UTC for the calculations.'
                        )}
                    />
                </>
            )}

            {periodErrorMessage && (
                <p className={styles.periodError}>{periodErrorMessage}</p>
            )}
        </div>
    )
}

Period.propTypes = {
    period: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    dataset: PropTypes.object,
}

export default Period
