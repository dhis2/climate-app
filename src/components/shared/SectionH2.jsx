import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/SectionH2.module.css'

const SectionH2 = ({ title, number }) => {
    return (
        <div className={classes.container}>
            <h2 className={classes.header}>
                <span className={classes.number}>{number}</span>
                {title}
            </h2>
        </div>
    )
}

SectionH2.propTypes = {
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
}

export default SectionH2
