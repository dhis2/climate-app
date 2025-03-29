import i18n from '@dhis2/d2-i18n'
import { animation, elevationCredits } from '../../../../utils/chart.js'
import { colors } from '@dhis2/ui'

const createPlotLine = (value, text) => ({
    color: colors.grey600,
    width: 1.2,
    dashStyle: 'Dash',
    value,
    label: {
        text: `${text}<br>${i18n.t('{{value}} m', { value })}`,
        align: 'right',
        textAlign: 'left',
        x: 10,
        style: {
            color: colors.grey800,
        },
    },
    zIndex: 5,
})

const getChartConfig = (name, data) => {
    // const reducers = Object.keys(data)
    // console.log('reducers', reducers)

    // console.log('data', data)

    const { mean, min, max, histogram } = data

    const elevations = Object.keys(histogram)
        .map(Number)
        .sort((a, b) => a - b)

    const values = Object.values(histogram).map((v) => v['area'])

    const series = elevations.map((elevation) => ({
        x: histogram[String(elevation)]['area'],
        y: elevation,
    }))

    const minArea = Math.min(...values)
    const maxArea = Math.max(...values)

    // console.log('elevations', minElevation, maxElevation, elevations)

    // frequency / histogram
    // https://www.linkedin.com/pulse/histograms-dem-values-chonghua-yin/
    // https://gsp.humboldt.edu/olm/Lessons/GSP_270/HTML%205%20Canvas%20Lessons/Histograms2.html

    return {
        title: {
            text: i18n.t('{{name}}: Elevation', {
                name,
                nsSeparator: ';',
            }),
        },
        credits: elevationCredits,
        tooltip: {
            // crosshairs: true,
            // shared: true,
            // valueSuffix: '°C',
        },
        legend: { enabled: false },
        xAxis: {
            labels: {
                format: '{value} ha',
            },
            // title: 'Test',
            /*
            type: 'datetime',
            tickInterval: 2592000000,
            labels: {
                format: '{value: %b}',
            },
            */
            // title: 'Area',
            /*
            title: {
                text: 'Area',
            },
            */
            min: minArea,
            max: maxArea,
            // crosshair: true,
        },
        yAxis: {
            title: false,
            labels: {
                format: '{value} m',
            },
            min,
            max,
            lineWidth: 1,
            plotLines: [
                createPlotLine(min, i18n.t('Min elevation')),
                createPlotLine(Math.round(mean), i18n.t('Mean elevation')),
                createPlotLine(max, i18n.t('Max elevation')),
            ],
            // crosshair: true,
        },
        chart: {
            type: 'area',
            // inverted: true,
            height: 480,
            marginBottom: 75,
            marginRight: 120,
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
        tooltip: {
            crosshairs: true,
            formatter: function (tooltip) {
                // console.log('tooltip', this.point, tooltip)
                // If the point value is null, display 'Null'

                if (this.point.value === null) {
                    return 'Null'
                }
                // If not null, use the default formatter
                return tooltip.defaultFormatter.call(this, tooltip)
            },
        },

        series: [
            {
                name: 'Elevation',
                data: series,
                color: colors.teal300,

                /*
                dataLabels: {
                    enabled: true,
                    formatter: (a, b, c) => {
                        console.log('dataLabels', a, b, c)
                        // return this.point.label
                        return 'label'
                    },
                },
                */
            },
        ],
    }
}

export default getChartConfig
