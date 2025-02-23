import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { useState } from 'react'
import exploreStore from '../../store/exploreStore.js'
import { getNumberOfDays } from '../../utils/time.js'
import DatePicker from '../shared/DatePicker.jsx'
import styles from './styles/Period.module.css'
import ForecastToggle from "./ForecastToggle";

const maxDays = 1000

const DailyPeriodSelect = ({allowForecast = false}) => {
    const { dailyPeriod, setDailyPeriod } = exploreStore()
    const [period, setPeriod] = useState(dailyPeriod)

    const { startTime, endTime } = period
    const days = getNumberOfDays(startTime, endTime)

    return (
        <div className={styles.container}>
            <div className={styles.pickers}>
                <DatePicker
                    label={i18n.t('Start date')}
                    defaultVal={startTime}
                    onChange={(startTime) =>
                        setPeriod({ ...period, startTime })
                    }
                />
                <DatePicker
                    label={i18n.t('End date')}
                    defaultVal={endTime}
                    onChange={(endTime) => setPeriod({ ...period, endTime })}
                />
                <Button
                    disabled={days > maxDays}
                    onClick={() => setDailyPeriod(period)}
                >
                    Update
                </Button>
            </div>
            {/* Conditionally show the forecast toggle */}
            {allowForecast && (
                <div className={styles.forecastContainer}>
                    <ForecastToggle />
                </div>
            )}
            {days > maxDays && (
                <div className={styles.warning}>
                    {i18n.t('Maximum {{maxDays}} days allowed', { maxDays })}
                </div>
            )}
        </div>
    )
}

export default DailyPeriodSelect
