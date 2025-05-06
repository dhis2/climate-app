import i18n from '@dhis2/d2-i18n'
import { useCallback, useEffect } from 'react'
import YearSelect from './YearSelect'
import PropTypes from 'prop-types'
import styles from './styles/YearRange.module.css'
import { YEARLY } from '../../utils/time'

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
    }, [period, minYear, maxYear, onChange])

    if (period.periodType !== YEARLY) {
        return null
    }

    return (
        <div className={styles.yearRange}>
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
    period: PropTypes.shape({
        periodType: PropTypes.string.isRequired,
        startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
    }).isRequired,
    minYear: PropTypes.number.isRequired,
    maxYear: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default YearRange
