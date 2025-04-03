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
    WEEKLY,
    MONTHLY,
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

const getChartConfig = ({
    name,
    data,
    band,
    period,
    showWeekly,
    showMonthly,
    isFacility,
}) => {
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

    if (showWeekly) {
        series.push({
            type: 'line',
            data: getInterpolatedSeries({
                periodType: WEEKLY,
                period,
                data,
                band,
            }),
            name: i18n.t('Weekly'),
            color: colors.yellow600,
            lineWidth: 2,
            zIndex: 3,
        })
    }

    if (showMonthly) {
        series.push({
            type: 'line',
            data: getInterpolatedSeries({
                periodType: MONTHLY,
                period,
                data,
                band,
            }),
            name: i18n.t('Monthly'),
            color: colors.blue600,
            lineWidth: 3,
            zIndex: 4,
        })
    }

    return {
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
