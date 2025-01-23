import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import {
    getRelativeHumidity,
    kelvinToCelsius,
    roundOneDecimal,
    getTimeFromId,
} from '../../../../utils/calc'
import {
    animation,
    credits,
    getMonthFromId,
    getMonthlyPeriod,
} from '../../../../utils/chart'

const getChartConfig = (name, data, normals, referencePeriod) => {
    const dewpoint = data.map((d) => ({
        x: getTimeFromId(d.id),
        y: roundOneDecimal(kelvinToCelsius(d['dewpoint_temperature_2m'])),
    }))

    const temperature = data.map((d) => ({
        x: getTimeFromId(d.id),
        y: roundOneDecimal(kelvinToCelsius(d['temperature_2m'])),
    }))

    const humidity = data.map((d) => ({
        x: getTimeFromId(d.id),
        y: roundOneDecimal(
            getRelativeHumidity(
                kelvinToCelsius(d['temperature_2m']),
                kelvinToCelsius(d['dewpoint_temperature_2m'])
            )
        ),
    }))

    const monthMormals = data.map((d) => {
        const month = getMonthFromId(d.id)
        const normal = normals.find((n) => n.id === month)

        return {
            x: getTimeFromId(d.id),
            y: roundOneDecimal(
                getRelativeHumidity(
                    kelvinToCelsius(normal['temperature_2m']),
                    kelvinToCelsius(normal['dewpoint_temperature_2m'])
                )
            ),
        }
    })

    return {
        title: {
            text: i18n.t('{{name}}: Relative humidity {{period}}', {
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
        chart: {
            height: 480,
            marginBottom: 75,
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C',
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
        yAxis: [
            {
                title: {
                    text: 'Relative humidity',
                },
                labels: {
                    format: '{value}%',
                },
            },
            {
                title: {
                    text: 'Temperature',
                },
                labels: {
                    format: '{value}°C',
                },
                opposite: true,
            },
        ],
        series: [
            {
                name: 'Relative humidity',
                type: 'column',
                data: humidity,
                color: colors.blue500,
                tooltip: {
                    valueSuffix: '%',
                },
                zIndex: 1,
            },
            {
                name: i18n.t('Normal relative humidity'),
                type: 'column',
                data: monthMormals,
                color: colors.blue200,
                pointPlacement: -0.2,
                zIndex: 0,
            },
            {
                type: 'line',
                data: dewpoint,
                yAxis: 1,
                name: i18n.t('Dewpoint temperature'),
                color: colors.grey900,
                zIndex: 2,
            },
            {
                type: 'line',
                data: temperature,
                yAxis: 1,
                name: i18n.t('Air temperature'),
                dashStyle: 'shortdot',
                color: colors.grey900,
                zIndex: 2,
            },
        ],
    }
}

export default getChartConfig
