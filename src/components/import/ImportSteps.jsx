import i18n from '@dhis2/d2-i18n'
import { CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './styles/ImportSteps.module.css'

const Step = ({ label, active, done }) => (
    <div
        className={`${styles.step}${
            !active && !done ? ` ${styles.pending}` : ''
        }`}
    >
        <span className={styles.icon}>
            {done ? (
                <span className={styles.checkmark}>✓</span>
            ) : active ? (
                <CircularLoader small />
            ) : null}
        </span>
        {label}
    </div>
)

Step.propTypes = {
    label: PropTypes.string.isRequired,
    active: PropTypes.bool,
    done: PropTypes.bool,
}

const ImportSteps = ({ extractingLabel, extractDone, importDone }) => (
    <div className={styles.steps}>
        <Step
            label={extractingLabel}
            active={!extractDone}
            done={extractDone}
        />
        <Step
            label={i18n.t('Importing data to DHIS2')}
            active={extractDone && !importDone}
            done={importDone}
        />
    </div>
)

ImportSteps.propTypes = {
    extractingLabel: PropTypes.string.isRequired,
    extractDone: PropTypes.bool,
    importDone: PropTypes.bool,
}

export default ImportSteps
