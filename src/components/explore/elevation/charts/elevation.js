import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { roundOneDecimal } from '../../../../utils/calc.js'
import { animation, elevationCredits } from '../../../../utils/chart.js'

// Max elevation range before binning is applied
const maxElevationRange = 2000

// Calculate the bin size based on the data length
const getBinSize = (dataLength) => {
    const desiredBins = 100
    let binSize = 1

    while (dataLength / binSize > desiredBins) {
        binSize *= 10
    }

    return binSize
}

// Create binned data from the histogram
const createBinnedData = (histogram, binSize) =>
    Object.entries(histogram).reduce((acc, [elevation, value]) => {
        const bin = Math.floor(elevation / binSize) * binSize
        if (!acc[bin]) {
            acc[bin] = { area: 0 }
        }
        acc[bin].area += value.area
        return acc
    }, {})

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
    const useBinning = max - min > maxElevationRange

    const binSize = getBinSize(max - min)

    const binnedData = useBinning
        ? createBinnedData(histogram, binSize)
        : histogram

    const elevations = Object.keys(binnedData)
        .map(Number)
        .sort((a, b) => a - b)

    const values = Object.values(binnedData).map((v) => v['area'])

    const series = elevations.map((elevation) => ({
        x: binnedData[String(elevation)]['area'],
        y: elevation,
    }))

    // Ensure the first point is the minimum elevation
    if (useBinning && series[0].y < min) {
        series[0] = {
            x: 0,
            y: min,
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
                let elevation = this.point.y

                if (useBinning) {
                    elevation += ' - ' + (elevation + binSize)
                }

                return `${i18n.t('Elevation: {{value}} m', {
                    value: elevation,
                    nsSeparator: ';',
                })}<br />${i18n.t('Area: {{value}} km²', {
                    value: roundOneDecimal(this.point.x),
                    nsSeparator: ';',
                })}`
            },
        },
        legend: { enabled: false },
        xAxis: {
            labels: {
                format: '{value} km²',
            },
            min: minArea,
            max: maxArea * 1.01,
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
