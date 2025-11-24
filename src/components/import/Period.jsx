import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useUserLocale from '../../hooks/useUserLocale.js'
import { DAILY, WEEKLY, SIXTEEN_DAYS, YEARLY } from '../../utils/time.js'
import TimeZone from '../shared/TimeZone.jsx'
import PeriodType from './PeriodType.jsx'
import styles from './styles/Period.module.css'
import YearRange from './YearRange.jsx'

const Period = ({ calendar, period, dataset = {}, onChange }) => {
    const { locale } = useUserLocale()
    const {
        periodType: datasetPeriodType,
        period: datasetPeriod,
        minYear,
        maxYear,
    } = dataset
    const { periodType, startTime, endTime } = period
    const hasNoPeriod = datasetPeriodType === 'N/A'
    const isYearly = datasetPeriodType === YEARLY

    // Set period locale from user settings
    useEffect(() => {
        if (period && locale && locale !== period.locale) {
            onChange({ ...period, locale })
        }
    }, [locale, onChange, period])

    useEffect(() => {
        if (
            datasetPeriodType === SIXTEEN_DAYS &&
            [DAILY, YEARLY].includes(period.periodType)
        ) {
            onChange({ ...period, periodType: WEEKLY })
        }
    }, [period, datasetPeriodType, onChange])

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
                    minYear={minYear}
                    maxYear={maxYear}
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
