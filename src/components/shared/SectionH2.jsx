import PropTypes from 'prop-types'
import React from 'react'

const SectionH2 = ({ title, number = 1 }) => {
    return (
        <div style={{ display: 'block', marginBottom: '8px' }}>
            <h2>
                <span
                    style={{
                        backgroundColor: '#E8EDF2',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px',
                        fontSize: '14px',
                    }}
                >
                    {number}
                </span>
                {title}
            </h2>
        </div>
    )
}

SectionH2.propTypes = {
    title: PropTypes.string.isRequired,
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default SectionH2
