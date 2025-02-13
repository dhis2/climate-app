import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import {
    animation,
    vegetationCredits,
    getDailyPeriod,
} from '../../../../utils/chart'
import { interpolate, roundTwoDecimals } from '../../../../utils/calc'
import { addPeriodTimestamp, getMiddleTime } from '../../../../utils/time'

const getChartConfig = (name, data, band = 'value') => {
    const years = [...new Set(data.map((d) => d.id.slice(0, 4)).map(Number))]

    const series = years.map((year) =>
        data
            .filter((d) => d.id.startsWith(year))
            .map((d) => ({
                // x: new Date(d.id).getTime() + eightDaysInMs, // TODO: Remove eightDaysInMs,
                x: getMiddleTime(d),
                y: roundTwoDecimals(d[band] * 0.0001),
            }))
    )

    const last = series.length - 1

    const lastYear = data
        .filter((d) => d.id.startsWith('2024'))
        .map((d) => ({
            ...d,
            middleTime: getMiddleTime(d),
        }))
    const lastYearSeries = lastYear.map((d) => ({
        x: getMiddleTime(d),
        y: d[band] * 0.0001,
    }))

    const weeks = generateFixedPeriods({
        year: 2024,
        calendar: 'gregory',
        locale: 'en',
        periodType: 'WEEKLY',
    })
        .map(addPeriodTimestamp)
        .map((p) => {
            const value = interpolate(lastYear, p.middleTime, band)
            return {
                x: p.middleTime,
                y: value !== null ? value * 0.0001 : null,
            }
        })

    const months = generateFixedPeriods({
        year: 2024,
        calendar: 'gregory',
        locale: 'en',
        periodType: 'MONTHLY',
    })
        .map(addPeriodTimestamp)
        .map((p) => {
            const value = interpolate(lastYear, p.middleTime, band)

            return {
                x: p.middleTime,
                y: value !== null ? value * 0.0001 : null,
            }
        })

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
        // https://jsfiddle.net/BlackLabel/bvr639p5/
        /*
    xAxis: {
      type: "datetime",
      tickInterval: 2592000000,
      labels: {
        format: "{value: %b}",
      },
    },
    */
        xAxis: years.map((year, index) => ({
            type: 'datetime',
            visible: index === 0,
            dateTimeLabelFormats: {
                month: '%b',
            },
            top: '0%',
            height: '100%',
            min: Date.UTC(year, 0, 1),
            max: Date.UTC(year, 11, 31),
        })),
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
        /*
        series: series.map((s, i) => ({
            type: 'spline',
            xAxis: i,
            data: s,
            name: years[i],
            color: i === last ? colors.green500 : colors.green300,
            lineWidth: i === last ? 3 : 1,
            marker: {
                enabled: false,
            },
            zIndex: i === last ? 2 : 1,
        })),
        */
        series: [
            /*
            ...series.map((s, i) => ({
                type: 'spline',
                xAxis: i,
                data: s,
                name: years[i],
                color: i === last ? colors.green500 : colors.green300,
                lineWidth: i === last ? 3 : 1,
                marker: {
                    enabled: false,
                },
                zIndex: i === last ? 2 : 1,
            })),
            */
            {
                type: 'line',
                xAxis: last,
                data: lastYearSeries,
                name: '16-days',
                color: colors.green500,
                lineWidth: 3,
                zIndex: 2,
            },
            {
                type: 'line',
                xAxis: last,
                data: weeks,
                name: 'Weekly',
                color: colors.red300,
                lineWidth: 1.5,
                zIndex: 3,
            },
            {
                type: 'line',
                xAxis: last,
                data: months,
                name: 'Monthly',
                color: colors.blue300,
                lineWidth: 1.5,
                zIndex: 4,
            },
        ],
    }
}

export default getChartConfig
