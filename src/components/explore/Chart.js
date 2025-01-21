import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import accessibility from 'highcharts/modules/accessibility'
import highchartsMore from 'highcharts/highcharts-more'
import exporting from 'highcharts/modules/exporting'
import patternFill from 'highcharts/modules/pattern-fill'
import React, { useRef, useLayoutEffect } from 'react'

accessibility(Highcharts)
exporting(Highcharts)
highchartsMore(Highcharts)
patternFill(Highcharts)

const Chart = ({ config }) => {
    const chartRef = useRef()

    useLayoutEffect(() => {
        Highcharts.chart(chartRef.current, config)
    }, [config, chartRef])

    return <div ref={chartRef} />
}

Chart.propTypes = {
    config: PropTypes.object.isRequired,
}

export default Chart
