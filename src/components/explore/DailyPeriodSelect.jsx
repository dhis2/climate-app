import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import propTypes from 'prop-types'
import { useState } from 'react'
import exploreStore from '../../store/exploreStore.js'
import { getNumberOfDays } from '../../utils/time.js'
import DatePicker from '../shared/DatePicker.jsx'
import styles from './styles/Period.module.css'

const maxDays = 1000

const DailyPeriodSelect = ({ disabled = false }) => {
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
                    disabled={days > maxDays || disabled}
                    onClick={() => setDailyPeriod(period)}
                >
                    {i18n.t('Update')}
                </Button>
            </div>
            {days > maxDays && (
                <div className={styles.warning}>
                    {i18n.t('Maximum {{maxDays}} days allowed', { maxDays })}
                </div>
            )}
        </div>
    )
}

DailyPeriodSelect.propTypes = {
    disabled: propTypes.bool,
}

export default DailyPeriodSelect
