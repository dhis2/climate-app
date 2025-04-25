import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { getTimeFromId, toCelcius } from '../../../utils/calc.js'
import {
    animation,
    getDailyPeriod,
} from '../../../utils/chart.js'

const getChartConfig = ({ orgUnitName, dataset, data, settings }) => {
    //const { tempMin, tempMax } = settings

    const series = data.map((d) => ({
        x: getTimeFromId(d.id),
        y: d['value'],
    }))

    //const minMax = data.map((d) => [
    //    getTimeFromId(d.id),
    //    d['value'],
    //])

    return {
        title: {
            text: i18n.t('{{orgUnitName}}: {{dataName}} {{period}}', {
                orgUnitName,
                dataName: dataset.shortName,
                period: getDailyPeriod(data),
                nsSeparator: ';',
            }),
        },
        credits: {text: dataset.source, href: dataset.sourceUrl},
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
                format: '{value} ' + dataset?.units,
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
                name: i18n.t('{{dataName}}', {dataName: dataset.shortName}),
                color: colors.red800,
                negativeColor: colors.blue800,
                zIndex: 2,
            },
        ],
    }
}

export default getChartConfig
