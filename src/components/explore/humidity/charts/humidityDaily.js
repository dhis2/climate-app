import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import {
    getRelativeHumidity,
    kelvinToCelsius,
    roundOneDecimal,
    getTimeFromId,
} from '../../../../utils/calc'
import { animation, credits, getDailyPeriod } from '../../../../utils/chart'

const getChart = (name, data) => {
    const humidity = data.map((d) => ({
        x: getTimeFromId(d.id),
        y: roundOneDecimal(
            getRelativeHumidity(
                kelvinToCelsius(d['temperature_2m']),
                kelvinToCelsius(d['dewpoint_temperature_2m'])
            )
        ),
    }))

    return {
        title: {
            text: i18n.t('{{name}}: Daily relative humidity {{period}}', {
                name,
                period: getDailyPeriod(data),
                nsSeparator: ';',
            }),
        },
        credits,
        chart: {
            height: 480,
            marginBottom: 75,
            zoomType: 'x',
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C',
        },
        plotOptions: {
            series: {
                pointPadding: 0,
                groupPadding: 0,
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
            max: 100,
            title: false,
            labels: {
                format: '{value}%',
            },
        },
        series: [
            {
                data: humidity,
                name: i18n.t('Relative humidity'),
                color: colors.blue500,
                lineWidth: 1.5,
                zIndex: 2,
            },
        ],
    }
}

export default getChart
