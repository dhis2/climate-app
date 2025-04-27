import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { useState } from 'react'
import localStore from '../../store/localStore.js'
import { getNumberOfMonths } from '../../utils/time.js'
import MonthPicker from '../shared/MonthPicker.jsx'
import styles from './styles/Period.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSyncLocalStoreFromUrl } from '../../hooks/useSyncLocalStoreFromUrl.jsx'

const maxMonths = 60

const MonthlyPeriodSelect = () => {
    const { ready } = useSyncLocalStoreFromUrl()
    const navigate = useNavigate()
    const path = useLocation().pathname

    const { monthlyPeriod } = localStore()
    const [period, setPeriod] = useState(monthlyPeriod)

    const { startTime, endTime } = period
    const months = getNumberOfMonths(startTime, endTime)

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
                <MonthPicker
                    label={i18n.t('Start month')}
                    defaultVal={startTime}
                    onChange={(startTime) =>
                        setPeriod({ ...period, startTime })
                    }
                />
                <MonthPicker
                    label={i18n.t('End month')}
                    defaultVal={endTime}
                    onChange={(endTime) => setPeriod({ ...period, endTime })}
                />
                <Button
                    disabled={months > maxMonths}
                    onClick={() => handleChange(period)}
                >
                    Update
                </Button>
            </div>
            {months > maxMonths && (
                <div className={styles.warning}>
                    {i18n.t('Maximum {{maxMonths}} months allowed', {
                        maxMonths,
                    })}
                </div>
            )}
        </div>
    )
}

export default MonthlyPeriodSelect
