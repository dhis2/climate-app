import PropTypes from 'prop-types'
import styles from './styles/ErrorMessage.module.css'

const ErrorMessage = ({ error }) => (
    <div className={styles.container}>{error.message || error}</div>
)

ErrorMessage.propTypes = {
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
}

export default ErrorMessage
