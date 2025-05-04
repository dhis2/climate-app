import i18n from '@dhis2/d2-i18n'
import { SegmentedControl } from '@dhis2/ui'
import localStore from '../../store/localStore.js'
import { DAILY, MONTHLY } from '../../utils/time.js'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import styles from './styles/PeriodTypeSelect.module.css'

const PeriodTypeSelect = () => {
    const { periodType, setPeriodType } = localStore()
    const {orgUnitId, serverId, datasetId, startTime, endTime } = useParams()
    const navigate = useNavigate()
    const path = useLocation().pathname

    const handleChange = ({value}) => {
        let pathParts = path.split('/')
        pathParts[pathParts.length-3] = value.toLowerCase()
        const newPath = pathParts.join('/')
        if (newPath != path) {
            console.log('PeriodType button changed, redirecting from', path, 'to', newPath)
            navigate(newPath)
        }
    }

    return (
        <div className={styles.periodTypeButtons}>
            <SegmentedControl
                ariaLabel="Monthly or daily"
                onChange={handleChange}
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
