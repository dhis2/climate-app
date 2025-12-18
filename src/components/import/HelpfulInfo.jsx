import { IconInfo16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import classes from './styles/HelpfulInfo.module.css'

const HelpfulInfo = ({ text }) => {
    return (
        <div className={classes.info}>
            <IconInfo16 />
            <p>{text}</p>
        </div>
    )
}

HelpfulInfo.propTypes = {
    text: PropTypes.node.isRequired,
}

export default HelpfulInfo
