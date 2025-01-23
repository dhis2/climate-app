import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import TimeZone from '../shared/TimeZone.jsx'
import styles from './styles/Period.module.css'

const userSettingsQuery = {
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale'],
        },
    },
}

const Period = ({ calendar, period, onChange }) => {
    const result = useDataQuery(userSettingsQuery)
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } = result
    const { startTime, endTime } = period

    return (
        <div className={styles.container}>
            <h2>{i18n.t('Period')}</h2>
            <p>
                {i18n.t(
                    'Daily values will be imported between start and end dates'
                )}
            </p>
            <div className={styles.pickers}>
                <CalendarInput
                    label={i18n.t('Start date')}
                    date={startTime}
                    calendar={calendar}
                    locale={locale || 'en'}
                    defaultVal={startTime}
                    onDateSelect={({ calendarDateString }) =>
                        onChange({ ...period, startTime: calendarDateString })
                    }
                />
                <CalendarInput
                    label={i18n.t('End date')}
                    date={endTime}
                    calendar={calendar}
                    defaultVal={endTime}
                    onDateSelect={({ calendarDateString }) =>
                        onChange({ ...period, endTime: calendarDateString })
                    }
                />
                <TimeZone period={period} onChange={onChange} />
            </div>
        </div>
    )
}

Period.propTypes = {
    onChange: PropTypes.func.isRequired,
    calendar: PropTypes.string,
    period: PropTypes.object,
}

export default Period
