import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { getTimeFromId, toCelcius } from '../../../utils/calc.js'
import {
    animation,
    credits,
    getMonthlyPeriod,
    getMonthFromId,
} from '../../../utils/chart.js'

const getChartConfig = ({ name, data, settings }) => {
    //const { tempMin, tempMax } = settings

    const series = data.map((d) => ({
        x: getTimeFromId(d.id),
        y: d['value'],
    }))

    const minMax = data.map((d) => [
        getTimeFromId(d.id),
        d['value'],
    ])

    return {
        title: {
            text: i18n.t('{{name}}: Monthly temperatures {{period}}', {
                name,
                period: getMonthlyPeriod(data),
                nsSeparator: ';',
            }),
        },
        credits,
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C',
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 2592000000,
            labels: {
                format: '{value: %b}',
            },
        },
        yAxis: {
            title: false,
            labels: {
                format: '{value}°C',
            },
            //min: tempMin,
            //max: tempMax,
        },
        chart: {
            height: 480,
            marginBottom: 75,
        },
        plotOptions: {
            series: {
                animation,
            },
        },
        series: [
            {
                type: 'line',
                data: series,
                name: i18n.t('Mean temperature'),
                color: colors.red800,
                negativeColor: colors.blue800,
                zIndex: 2,
            },
        ],
    }
}

export default getChartConfig
