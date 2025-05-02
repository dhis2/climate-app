import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { roundOneDecimal } from '../../../../utils/calc.js'
import { animation, landCoverCredits } from '../../../../utils/chart.js'
import { landcoverTypes } from '../LandcoverSelect.jsx'

const band = 'LC_Type1'

const getChartConfig = (name, data, bands) => {
    console.log(name, data, bands)

    // const band = 'trees'

    const filteredData = data.filter((d) => d['trees'] !== undefined)

    const series = bands.map((band) => ({
        type: 'line',
        data: filteredData.map((d) => ({
            x: d.startTime,
            y: d[band],
        })),
        name: band,
        color: colors.green600,
        lineWidth: 3,
        zIndex: 2,
    }))

    return {
        /*
        title: {
            text: i18n.t('{{name}}: {{band}} vegetation index {{period}}', {
                name,
                band,
                period: getDailyPeriod(data),
                nsSeparator: ';',
            }),
        },
        subtitle: isFacility && {
            text: i18n.t(
                'Value is only for 250 x 250 m where the facility is located'
            ),
        },
        */
        // credits: vegetationCredits,
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
            min: 0,
            max: 1,
        },
        chart: {
            height: 480,
            marginBottom: 75,
        },
        plotOptions: {
            series: {
                animation,
            },
            /*
            column: {
                borderColor: null,
                pointPadding: 0,
                groupPadding: 0,
            },
            */
        },
        series,
    }

    /*
    const years = data.map((d) => d.id.slice(0, 4)).map(Number)

    const total = Object.values(data[0][band]).reduce(
        (acc, cur) => acc + cur,
        0
    )

    const keys = [
        ...new Set(data.map((d) => Object.keys(d[band]).map(Number)).flat()),
    ]

    // console.log("Keys", keys);

    const series = keys.map((key) => ({
        key,
        name: landcoverTypes.find((c) => c.value === key).name,
        color: landcoverTypes.find((c) => c.value === key).color,
        data: data.map((d) =>
            roundOneDecimal(((d[band][key] || 0) / total) * 100)
        ),
    }))

    series.sort((a, b) => {
        const aValue = data[0][band][a.key] || 0
        const bValue = data[0][band][b.key] || 0
        return aValue - bValue
    })
    */

    /*
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
        xAxis: {
            categories: years,
        },
        yAxis: {
            min: 0,
            max: 100,
            labels: {
                format: '{value}%',
            },
            title: {
                enabled: false,
            },
        },
        tooltip: {
            shared: true,
            headerFormat:
                '<span style="font-size:12px"><b>{point.key}</b></span><br>',
            valueSuffix: '%',
        },
        plotOptions: {
            series: {
                animation,
            },
            column: {
                stacking: 'normal',
                borderColor: null,
                // pointPadding: 0,
                groupPadding: 0,
            },
        },
        series,
    }
        */
}

export default getChartConfig
