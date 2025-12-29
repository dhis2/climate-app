import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import propTypes from 'prop-types'
import { useState } from 'react'
import exploreStore from '../../store/exploreStore.js'
import { getNumberOfMonths } from '../../utils/time.js'
import MonthPicker from '../shared/MonthPicker.jsx'
import styles from './styles/Period.module.css'

const maxMonths = 60

const MonthlyPeriodSelect = ({ disabled = false }) => {
    const { monthlyPeriod, setMonthlyPeriod } = exploreStore()
    const [period, setPeriod] = useState(monthlyPeriod)

    const { startTime, endTime } = period
    const months = getNumberOfMonths(startTime, endTime)

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
                    disabled={months > maxMonths || disabled}
                    onClick={() => setMonthlyPeriod(period)}
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

MonthlyPeriodSelect.propTypes = {
    disabled: propTypes.bool,
}

export default MonthlyPeriodSelect
