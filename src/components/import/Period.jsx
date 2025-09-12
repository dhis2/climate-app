import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { DAILY, WEEKLY, SIXTEEN_DAYS, YEARLY } from '../../utils/time.js'
import { normalizeIsoDate, formatPeriodString } from '../../utils/time.js'
import TimeZone from '../shared/TimeZone.jsx'
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

const Period = ({ calendar, period, dataset = {}, onChange }) => {
    const result = useDataQuery(userSettingsQuery)
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } = result
    console.log('period', period)
    const {
        periodType: datasetPeriodType,
        supportedPeriodTypes: datasetSupportedPeriodTypes,
        periodRange: datasetPeriodRange,
        period: datasetPeriod,
    } = dataset
    console.log('dataset period', datasetPeriodType, datasetSupportedPeriodTypes, datasetPeriodRange)
    const { periodType, startTime, endTime } = period
    const hasNoPeriod = datasetPeriodType === 'N/A'
    const isYearly = datasetPeriodType === YEARLY

    // Set period locale from user settings
    useEffect(() => {
        if (period && locale && locale !== period.locale) {
            onChange({ ...period, locale })
        }
    }, [locale, onChange, period])

    // For yearly datasets, force year range to fit within dataset range
    // TODO: Not sure if this should be inside useEffect, with onChange, or if this is ok... 
    //if (datasetPeriodType == YEARLY) {
    //    period.startTime = (period.startTime >= datasetPeriodRange.start) ? period.startTime : datasetPeriodRange.start
    //    period.endTime = (period.endTime <= datasetPeriodRange.end) ? period.endTime : datasetPeriodRange.end
    //    console.log('period changed', period)
    //}

    // Set min and max date for the calendar inputs
    // TODO: not working yet...
    let minDate = null
    let maxDate = null
    if (datasetPeriodRange) {
        minDate = normalizeIsoDate(datasetPeriodRange.start)
        maxDate = normalizeIsoDate(datasetPeriodRange.end)
    }
    console.log('Calendar input min/max date', minDate, maxDate)

    return (
        <div className={styles.container}>
            <h2>{i18n.t('Period')}</h2>
            {hasNoPeriod && (
                <p>
                    {i18n.t(
                        'The data will be assigned a default yearly period that matches the year it was collected: {{datasetPeriod}}',
                        { datasetPeriod, nsSeparator: ';' }
                    )}
                </p>
            )}
            {isYearly && (
                <YearRange
                    period={period}
                    minYear={parseInt(datasetPeriodRange.start)}
                    maxYear={parseInt(datasetPeriodRange.end)}
                    onChange={onChange}
                />
            )}
            {!hasNoPeriod && !isYearly && (
                <>
                    <p>
                        {i18n.t(
                            'Daily values will be imported between start and end dates'
                        )}
                    </p>
                    <div className={styles.pickers}>
                        <PeriodType
                            periodType={periodType}
                            supportedPeriodTypes={datasetSupportedPeriodTypes}
                            onChange={(periodType) =>
                                onChange({ ...period, periodType })
                            }
                        />
                        <CalendarInput
                            label={i18n.t('Start date')}
                            date={startTime}
                            minDate={minDate}
                            maxDate={maxDate}
                            calendar={calendar}
                            locale={locale || 'en'}
                            defaultVal={startTime}
                            onDateSelect={({ calendarDateString }) =>
                                onChange({
                                    ...period,
                                    startTime: calendarDateString,
                                })
                            }
                        />
                        <CalendarInput
                            label={i18n.t('End date')}
                            date={endTime}
                            minDate={minDate}
                            maxDate={maxDate}
                            calendar={calendar}
                            locale={locale || 'en'}
                            defaultVal={endTime}
                            onDateSelect={({ calendarDateString }) =>
                                onChange({
                                    ...period,
                                    endTime: calendarDateString,
                                })
                            }
                        />
                        <TimeZone period={period} onChange={onChange} />
                    </div>
                </>
            )}
            {datasetPeriodRange && (
                <p>
                    {i18n.t('Valid range')}: <strong>{formatPeriodString(datasetPeriodRange.start)}</strong> - <strong>{formatPeriodString(datasetPeriodRange.end)}</strong>
                </p>
            )}
        </div>
    )
}

Period.propTypes = {
    onChange: PropTypes.func.isRequired,
    calendar: PropTypes.string,
    dataset: PropTypes.object,
    period: PropTypes.object,
}

export default Period
