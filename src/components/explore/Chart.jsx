import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import accessibility from 'highcharts/modules/accessibility'
import exporting from 'highcharts/modules/exporting'
import patternFill from 'highcharts/modules/pattern-fill'
import PropTypes from 'prop-types'
import React, { useRef, useLayoutEffect } from 'react'

accessibility(Highcharts)
exporting(Highcharts)
highchartsMore(Highcharts)
patternFill(Highcharts)

const Chart = ({ config }) => {
    const chartRef = useRef()

    useLayoutEffect(() => {
        const mergedConfig = {
            ...config,
            credits: {
                ...config.credits,
                enabled: false,
            },
        }

        Highcharts.chart(chartRef.current, mergedConfig)
    }, [config])

    return (
        <>
            <div ref={chartRef} />
            <a
                href={config.credits?.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    fontSize: '10px',
                    color: 'grey',
                    display: 'block',
                    textAlign: 'right',
                    textDecoration: 'none',
                }}
            >
                {config.credits?.text}
            </a>
        </>
    )
}

Chart.propTypes = {
    config: PropTypes.object.isRequired,
}

export default Chart
