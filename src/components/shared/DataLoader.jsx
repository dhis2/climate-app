import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './styles/DataLoader.module.css'

const DataLoader = ({ label, height = 400 }) => (
    <div className={styles.container} style={{ height }}>
        <CenteredContent>
            <div className={styles.loader}>
                <CircularLoader small />
                {label ? label : i18n.t('Loading data')}
            </div>
        </CenteredContent>
    </div>
)

DataLoader.propTypes = {
    height: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
}

export default DataLoader
