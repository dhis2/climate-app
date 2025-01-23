import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { metersToMillimeters } from '../../../../utils/calc'
import { animation, credits, getDailyPeriod } from '../../../../utils/chart'

const getChart = (name, data, settings) => {
    const { precipDailyMax } = settings

    const series = data.map((d) => ({
        x: new Date(d.id).getTime(),
        y: metersToMillimeters(d['total_precipitation_sum']),
    }))

    return {
        title: {
            text: i18n.t('{{name}}: Daily precipitation {{period}}', {
                name,
                period: getDailyPeriod(data),
                nsSeparator: ';',
            }),
        },
        credits,
        tooltip: {
            valueSuffix: ' mm',
        },
        chart: {
            type: 'column',
            height: 480,
            zoomType: 'x',
            marginBottom: 75,
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
            max: precipDailyMax,
            title: false,
            labels: {
                format: '{value} mm',
            },
        },
        series: [
            {
                data: series,
                name: i18n.t('Daily precipitation'),
                color: colors.blue500,
                zIndex: 1,
            },
        ],
    }
}

export default getChart
