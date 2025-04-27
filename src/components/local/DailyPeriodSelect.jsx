import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { useState } from 'react'
import localStore from '../../store/localStore.js'
import { getNumberOfDays } from '../../utils/time.js'
import DatePicker from '../shared/DatePicker.jsx'
import styles from './styles/Period.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSyncLocalStoreFromUrl } from '../../hooks/useSyncLocalStoreFromUrl.jsx'

const maxDays = 1000

const DailyPeriodSelect = () => {
    const { ready } = useSyncLocalStoreFromUrl()
    const navigate = useNavigate()
    const path = useLocation().pathname

    const { dailyPeriod } = localStore()
    const [period, setPeriod] = useState(dailyPeriod)

    const { startTime, endTime } = period
    const days = getNumberOfDays(startTime, endTime)

    const handleChange = (p) => {
        let pathParts = path.split('/')
        pathParts[pathParts.length-2] = p.startTime
        pathParts[pathParts.length-1] = p.endTime
        const newPath = pathParts.join('/')
        navigate(newPath)
    }

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
                    onClick={() => handleChange(period)}
                >
                    Update
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

export default DailyPeriodSelect
