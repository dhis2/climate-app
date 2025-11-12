import { IconInfo16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './styles/HelpfulInfo.module.css'

const HelpfulInfo = ({ text }) => {
    return (
        <div className={styles.divider}>
            <IconInfo16 />
            <p>{text}</p>
        </div>
    )
}

HelpfulInfo.propTypes = {
    text: PropTypes.node.isRequired,
}

export default HelpfulInfo
