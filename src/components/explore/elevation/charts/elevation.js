import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { interpolate, roundTwoDecimals } from '../../../../utils/calc.js'
import {
    animation,
    vegetationCredits,
    getDailyPeriod,
} from '../../../../utils/chart.js'
import {
    addPeriodTimestamp,
    getMiddleTime,
    getPeriods,
} from '../../../../utils/time.js'

const getInterpolatedSeries = ({ periodType, period, data, band }) =>
    getPeriods({ ...period, periodType })
        .map(addPeriodTimestamp)
        .map((p) => {
            const value = interpolate(data, p.middleTime, band)
            return {
                x: p.middleTime,
                y: value !== null ? value * 0.0001 : null,
            }
        })

const getChartConfig = (name, data) => {
    console.log('config', name, data)

    const elevations = Object.keys(data.elevation)
    const values = Object.values(data.elevation)

    /*
    const series = elevations.map((elevation) => ({
        x: Number(elevation),
        y: values[elevation],
    }))
    */

    const series = values

    const minElevation = Number(elevations[0])
    const maxElevation = Number(elevations[elevations.length - 1])

    console.log('elevations', minElevation, maxElevation, series)

    // frequency / histogram
    // https://www.linkedin.com/pulse/histograms-dem-values-chonghua-yin/
    // https://gsp.humboldt.edu/olm/Lessons/GSP_270/HTML%205%20Canvas%20Lessons/Histograms2.html

    return {
        title: {
            text: 'Elevation',
        },
        // credits: vegetationCredits,
        tooltip: {
            // crosshairs: true,
            // shared: true,
            // valueSuffix: '°C',
        },
        yAxis: {
            /*
            type: 'datetime',
            tickInterval: 2592000000,
            labels: {
                format: '{value: %b}',
            },
            */
            // title: 'Area',
            title: {
                text: 'Area',
            },
            min: 0,
            max: 20000,
        },
        xAxis: {
            title: {
                text: 'Elevation',
            },
            min: minElevation,
            max: maxElevation,
        },
        chart: {
            type: 'area',
            // inverted: true,
            height: 480,
            marginBottom: 75,
        },
        /*
        plotOptions: {
            series: {
                animation,
            },
            column: {
                borderColor: null,
                pointPadding: 0,
                groupPadding: 0,
            },
        },
        */
        series: [
            {
                data: series,
                name: 'Elevation',
            },
        ],
    }

    /*
    const series = [
        {
            type: 'line',
            data: data.map((d) => ({
                x: getMiddleTime(d),
                y: roundTwoDecimals(d[band] * 0.0001),
            })),
            name: '16-days',
            color: colors.green600,
            lineWidth: 3,
            zIndex: 2,
        },
    ]
    */

    // Used to debug WEEKLY and MONTHLY interpolation
    if (periodType) {
        series.push({
            type: 'line',
            data: getInterpolatedSeries({
                periodType,
                period,
                data,
                band,
            }),
            name: periodType,
            color: '#555',
            lineWidth: 1,
            zIndex: 3,
        })
    }

    return {
        title: {
            text: i18n.t('{{name}}: {{band}} vegetation index 2024', {
                name,
                band,
                period: getDailyPeriod(data),
                nsSeparator: ';',
            }),
        },
        credits: vegetationCredits,
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
            column: {
                borderColor: null,
                pointPadding: 0,
                groupPadding: 0,
            },
        },
        series,
    }
}

export default getChartConfig
