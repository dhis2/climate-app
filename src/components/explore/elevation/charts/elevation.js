import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { animation, elevationCredits } from '../../../../utils/chart.js'

const getBinSize = (dataLength) => {
    const desiredBins = 100
    let binSize = 1

    while (dataLength / binSize > desiredBins) {
        binSize *= 10
    }

    return binSize
}

const createPlotLine = (value, text) => ({
    color: colors.grey600,
    width: 1.2,
    dashStyle: 'Dash',
    value,
    label: {
        text: `${text}<br>${i18n.t('{{value}} m', { value })}`,
        align: 'right',
        textAlign: 'left',
        x: 10,
        style: {
            color: colors.grey800,
        },
    },
    zIndex: 5,
})

const getChartConfig = (name, data) => {
    const { mean, min, max, histogram } = data

    const elevations = Object.keys(histogram)
        .map(Number)
        .sort((a, b) => a - b)

    let values
    let series
    let binSize

    if (elevations.length <= 100) {
        values = Object.values(histogram).map((v) => v['area'])

        series = elevations.map((elevation) => ({
            x: histogram[String(elevation)]['area'],
            y: elevation,
        }))
    } else {
        binSize = getBinSize(elevations.length)

        const binned = Object.entries(histogram).reduce(
            (acc, [elevation, value]) => {
                const bin = Math.floor(elevation / binSize) * binSize
                if (!acc[bin]) {
                    acc[bin] = { area: 0 }
                }
                acc[bin].area += value.area
                return acc
            },
            {}
        )

        values = Object.values(binned).map((v) => v['area'])

        series = Object.entries(binned).map(([elevation, value]) => ({
            x: value.area,
            y: Number(elevation),
        }))

        if (series[0].y < min) {
            series[0] = { x: 0, y: min }
        }
    }

    const minArea = Math.min(...values)
    const maxArea = Math.max(...values)

    return {
        title: {
            text: i18n.t('{{name}}: Elevation', {
                name,
                nsSeparator: ';',
            }),
        },
        chart: {
            type: 'area',
            height: 480,
            marginBottom: 75,
            marginRight: 120,
        },
        credits: elevationCredits,
        tooltip: {
            formatter: function () {
                let elevation = Math.round(this.point.y)

                if (binSize) {
                    elevation += ' - ' + (elevation + binSize)
                }

                return `${i18n.t('Elevation: {{value}} m', {
                    value: elevation,
                    nsSeparator: ';',
                })}<br />${i18n.t('Area: {{value}} ha', {
                    value: Math.round(this.point.x),
                    nsSeparator: ';',
                })}`
            },
        },
        legend: { enabled: false },
        xAxis: {
            labels: {
                format: '{value} ha',
            },
            min: minArea,
            max: maxArea,
            crosshair: false,
        },
        yAxis: {
            title: false,
            labels: {
                format: '{value} m',
            },
            min,
            max,
            lineWidth: 1,
            plotLines: [
                createPlotLine(min, i18n.t('Min elevation')),
                createPlotLine(Math.round(mean), i18n.t('Mean elevation')),
                createPlotLine(max, i18n.t('Max elevation')),
            ],
        },
        plotOptions: {
            series: {
                animation,
            },
        },
        series: [
            {
                name: i18n.t('Elevation'),
                data: series,
                color: colors.teal300,
            },
        ],
    }
}

export default getChartConfig
