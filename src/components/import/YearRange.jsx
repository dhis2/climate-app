import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { YEARLY } from '../../utils/time.js'
import styles from './styles/YearRange.module.css'
import YearSelect from './YearSelect.jsx'

const YearRange = ({ period, minYear, maxYear, onChange }) => {
    const onYearChange = useCallback(
        (key) => (year) => onChange({ ...period, [key]: year }),
        [period, onChange]
    )

    useEffect(() => {
        if (period.periodType !== YEARLY) {
            onChange({
                ...period,
                periodType: YEARLY,
                startTime: minYear,
                endTime: maxYear,
            })
        }
    }, [maxYear, minYear, period, onChange])

    if (period.periodType !== YEARLY) {
        return null
    }

    return (
        <div className={styles.pickers}>
            <YearSelect
                label={i18n.t('Start year')}
                year={period.startTime}
                minYear={minYear}
                maxYear={maxYear}
                onChange={onYearChange('startTime')}
            />
            <YearSelect
                label={i18n.t('End year')}
                year={period.endTime}
                minYear={minYear}
                maxYear={maxYear}
                onChange={onYearChange('endTime')}
            />
        </div>
    )
}

YearRange.propTypes = {
    maxYear: PropTypes.number.isRequired,
    minYear: PropTypes.number.isRequired,
    period: PropTypes.shape({
        endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        periodType: PropTypes.string.isRequired,
        startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
}

export default YearRange
