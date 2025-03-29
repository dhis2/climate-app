import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { animation, elevationCredits } from '../../../../utils/chart.js'

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

    const values = Object.values(histogram).map((v) => v['area'])

    const series = elevations.map((elevation) => ({
        x: histogram[String(elevation)]['area'],
        y: elevation,
    }))

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
                return `${i18n.t('Elevation: {{value}} m', {
                    value: Math.round(this.point.y),
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
