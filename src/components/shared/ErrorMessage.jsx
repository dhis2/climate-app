import PropTypes from 'prop-types'
import styles from './styles/ErrorMessage.module.css'

const ErrorMessage = ({ error }) => (
    <div className={styles.container}>{error.message}</div>
)

ErrorMessage.propTypes = {
    error: PropTypes.object,
}

export default ErrorMessage
