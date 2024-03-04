import PropTypes from "prop-types";
import styles from "./styles/ErrorMessage.module.css";

const ErrorMessage = ({ error }) => (
  <div className={styles.container}>
    <p>{error.message}</p>
  </div>
);

ErrorMessage.propTypes = {
  error: PropTypes.object,
};

export default ErrorMessage;
