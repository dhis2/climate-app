import i18n from '@dhis2/d2-i18n'
import { SegmentedControl } from '@dhis2/ui'
import { DAILY, MONTHLY } from '../../utils/time'
import exploreStore from '../../store/exploreStore'
import styles from './styles/PeriodTypeSelect.module.css'

const PeriodTypeSelect = () => {
    const { periodType, setPeriodType } = exploreStore()

    return (
        <div className={styles.periodTypeButtons}>
            <SegmentedControl
                ariaLabel="Monthly or daily"
                onChange={({ value }) => setPeriodType(value)}
                options={[
                    {
                        label: i18n.t('Monthly'),
                        value: MONTHLY,
                    },
                    {
                        label: i18n.t('Daily'),
                        value: DAILY,
                    },
                ]}
                selected={periodType}
            />
        </div>
    )
}

export default PeriodTypeSelect
