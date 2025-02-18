import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { getTimeFromId, metersToMillimeters } from '../../../../utils/calc.js'
import {
    animation,
    credits,
    getMonthlyPeriod,
    getMonthFromId,
} from '../../../../utils/chart.js'

const band = 'total_precipitation_sum'
const forecastBand = 'forecast_precipitation_sum'

const getChartConfig = ({ name, data, forecastData, normals, referencePeriod, settings }) => {
    const { precipMonthlyMax } = settings

    const series = data.map((d) => ({
        x: getTimeFromId(d.id),
        y: metersToMillimeters(d[band]),
    }))

    const monthMormals = data.map((d) => {
        const month = getMonthFromId(d.id)
        const normal = normals.find((n) => n.id === month)

        return {
            x: getTimeFromId(d.id),
            y: metersToMillimeters(normal[band]),
        }
    })

    const seriesConfig = [
        {
            data: series,
            name: i18n.t('Monthly precipitation'),
            color: colors.blue500,
            zIndex: 1,
        },
        {
            data: monthMormals,
            name: i18n.t('Normal precipitation'),
            color: colors.blue200,
            pointPlacement: -0.2,
            zIndex: 0,
        },
    ]

    if (forecastData) {
        const forecastSeries = forecastData.map((d) => ({
            x: getTimeFromId(d.id),
            y: metersToMillimeters(d[forecastBand]),
        }))
        console.log('forecast data', forecastData)
        console.log('forecast series', forecastSeries)

        seriesConfig.push({
            data: forecastSeries,
            name: i18n.t('Monthly precipitation forecast'),
            color: '#B19CD8',
            zIndex: 2,
        })
    }

    return {
        title: {
            text: i18n.t('{{name}}: Monthly precipitation {{period}}', {
                name,
                period: getMonthlyPeriod(data),
                nsSeparator: ';',
            }),
        },
        subtitle: {
            text: i18n.t('Normals from reference period: {{period}}', {
                period: referencePeriod.id,
                nsSeparator: ';',
            }),
        },
        credits,
        tooltip: {
            shared: true,
            valueSuffix: ' mm',
        },
        chart: {
            type: 'column',
            height: 480,
            marginBottom: 75,
        },
        plotOptions: {
            series: {
                grouping: false,
                borderWidth: 0,
                animation,
            },
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 2592000000,
            labels: {
                format: '{value: %b}',
            },
        },
        yAxis: {
            min: 0,
            max: precipMonthlyMax,
            title: false,
            labels: {
                format: '{value} mm',
            },
        },
        series: seriesConfig,
    }
}

export default getChartConfig
