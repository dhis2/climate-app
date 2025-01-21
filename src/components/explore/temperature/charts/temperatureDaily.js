import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { animation, credits, getDailyPeriod } from '../../../../utils/chart'
import { toCelcius } from '../../../../utils/calc'

const getChart = (name, data, settings) => {
    const { tempMin, tempMax } = settings

    const series = data.map((d) => ({
        x: new Date(d.id).getTime(),
        y: toCelcius(d['temperature_2m']),
    }))

    const minMax = data.map((d) => [
        new Date(d.id).getTime(),
        toCelcius(d['temperature_2m_min']),
        toCelcius(d['temperature_2m_max']),
    ])

    return {
        title: {
            text: i18n.t('{{name}}: Daily temperatures {{period}}', {
                name,
                period: getDailyPeriod(data),
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
            min: tempMin,
            max: tempMax,
        },
        chart: {
            height: 480,
            marginBottom: 75,
            zoomType: 'x',
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
                lineWidth: 1.5,
                zIndex: 2,
            },
            {
                type: 'arearange',
                name: i18n.t('Temperature range'),
                data: minMax,
                color: colors.red200,
                negativeColor: colors.blue200,
                marker: {
                    enabled: false,
                },
                zIndex: 0,
            },
        ],
    }
}

export default getChart
