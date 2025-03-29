import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { DAILY, SIXTEEN_DAYS, WEEKLY } from '../../utils/time.js'
import TimeZone from '../shared/TimeZone.jsx'
import PeriodType from './PeriodType.jsx'
import styles from './styles/Period.module.css'

const userSettingsQuery = {
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale'],
        },
    },
}

const Period = ({
    calendar,
    period,
    datasetPeriodType,
    datasetPeriod,
    onChange,
}) => {
    const result = useDataQuery(userSettingsQuery)
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } = result
    const { periodType, startTime, endTime } = period
    const isTemporalDataset = datasetPeriodType !== 'N/A'

    // Set period locale from user settings
    useEffect(() => {
        if (period && locale && locale !== period.locale) {
            onChange({ ...period, locale })
        }
    }, [locale, onChange, period])

    useEffect(() => {
        if (datasetPeriodType === SIXTEEN_DAYS && period.periodType === DAILY) {
            onChange({ ...period, periodType: WEEKLY })
        }
    }, [period, datasetPeriodType, onChange])

    return (
        <div className={styles.container}>
            <h2>{i18n.t('Period')}</h2>
            {isTemporalDataset ? (
                <>
                    <p>
                        {i18n.t(
                            'Daily values will be imported between start and end dates'
                        )}
                    </p>
                    <div className={styles.pickers}>
                        <PeriodType
                            periodType={periodType}
                            datasetPeriodType={datasetPeriodType}
                            onChange={(periodType) =>
                                onChange({ ...period, periodType })
                            }
                        />
                        <CalendarInput
                            label={i18n.t('Start date')}
                            date={startTime}
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
            ) : (
                <p>
                    {i18n.t(
                        "The data don't have a period. It will be imported with the year the data was collected ({{datasetPeriod}}).",
                        { datasetPeriod }
                    )}
                </p>
            )}
        </div>
    )
}

Period.propTypes = {
    onChange: PropTypes.func.isRequired,
    calendar: PropTypes.string,
    datasetPeriodType: PropTypes.string,
    period: PropTypes.object,
}

export default Period
