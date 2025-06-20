import i18n from '@dhis2/d2-i18n'
import { roundOneDecimal } from '../../../../utils/calc.js'
import { animation, landCoverCredits } from '../../../../utils/chart.js'
import { band } from '../Landcover.jsx'
import { landcoverTypes } from '../LandcoverSelect.jsx'

const getChartConfig = (name, data, type) => {
    const legend = landcoverTypes.find((c) => c.value === type)

    const years = data.map((d) => d.id.slice(0, 4)).map(Number)

    const total = Object.values(data[0][band]).reduce(
        (acc, cur) => acc + cur,
        0
    )

    const series = data.map((d, i) => ({
        x: years[i],
        y: roundOneDecimal(((d[band][type] || 0) / total) * 100),
    }))

    const maxValue = Math.max(...series.map((d) => d.y))

    return {
        chart: {
            type: 'column',
            height: 580,
        },
        title: {
            text: i18n.t('{{name}}: Land cover changes {{years}}', {
                name,
                years: `${years[0]}-${years[years.length - 1]}`,
                nsSeparator: ';',
            }),
        },
        credits: landCoverCredits,
        yAxis: {
            min: 0,
            max: maxValue <= 1 ? 1 : undefined,
            labels: {
                format: '{value}%',
            },
            title: {
                enabled: false,
            },
        },
        tooltip: {
            valueSuffix: '%',
        },
        plotOptions: {
            series: {
                animation,
            },
            column: {
                groupPadding: 0,
            },
        },
        series: [
            {
                data: series,
                name: legend.name,
                color: legend.color,
                zIndex: 1,
            },
        ],
    }
}

export default getChartConfig
