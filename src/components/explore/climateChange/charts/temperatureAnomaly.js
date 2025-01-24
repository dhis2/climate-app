import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { roundOneDecimal } from '../../../../utils/calc.js'
import { animation, credits } from '../../../../utils/chart.js'
import { padWithZeroes } from '../../../../utils/time.js'
import { months } from '../../MonthSelect.jsx'

const band = 'temperature_2m'

const getChartConfig = (
    name,
    data,
    normals,
    month,
    referencePeriod,
    settings
) => {
    const normal = normals.find((n) => n.id === padWithZeroes(month))[band]
    const years = data.map((d) => d.id.substring(0, 4))
    const monthName = months.find((m) => m.id === month).name
    const series = data.map((d) => roundOneDecimal(d[band] - normal))
    const { tempChange } = settings

    return {
        title: {
            text: i18n.t(
                '{{name}}: {{month}} temperature difference {{years}}',
                {
                    name,
                    month: monthName,
                    years: `${years[0]}-${years[years.length - 1]}`,
                    nsSeparator: ';',
                }
            ),
        },
        subtitle: {
            text: i18n.t('Reference period: {{period}}', {
                period: referencePeriod.id,
                nsSeparator: ';',
            }),
        },
        credits,
        tooltip: {
            shared: true,
            valueSuffix: '°C',
        },
        chart: {
            type: 'column',
            height: 480,
            marginBottom: 60,
        },
        plotOptions: {
            column: {
                pointWidth: 13,
                pointPadding: 0,
                borderWidth: 1,
            },
            series: {
                animation,
            },
        },
        xAxis: {
            type: 'category',
            categories: years,
            labels: {
                format: '{value: %b}',
            },
        },
        yAxis: {
            max: tempChange,
            min: tempChange !== undefined ? -tempChange : undefined,
            title: false,
            labels: {
                format: '{value}°C',
            },
        },
        series: [
            {
                data: series,
                name: i18n.t('Temperature anomaly'),
                color: colors.red500,
                negativeColor: colors.blue500,
            },
        ],
        legend: { enabled: false },
    }
}

export default getChartConfig
