import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { metersToMillimeters } from '../../../../utils/calc.js'
import { animation, credits, getDailyPeriod } from '../../../../utils/chart.js'

const band = 'total_precipitation_sum';
const forecastBand = 'forecast_precipitation_sum';

const getChart = (name, data, forecastData, settings) => {
    const { precipDailyMax } = settings

    // Historical precipitation
    const series = data.map((d) => ({
        x: new Date(d.id).getTime(),
        y: metersToMillimeters(d[band]),
    }))

    // ✅ Base series configuration
    const seriesConfig = [
        {
            data: series,
            name: i18n.t('Daily precipitation'),
            color: colors.blue500,
            zIndex: 1,
        },
    ];

    // ✅ If forecastData exists, append forecast series & extend normals
    if (forecastData?.length > 0) {
        console.log('Adding forecast series:', forecastData);

        // Forecast precipitation series
        const forecastSeries = forecastData.map((d) => ({
            x: new Date(d.id).getTime(),
            y: d[forecastBand], // TODO: currently the api returns in actual mm, so no conversion from meters needed, but should make this more flexible depending on the api... 
        })).sort((a, b) => a.x - b.x);

        // ✅ Add the forecast series
        seriesConfig.push({
            data: forecastSeries,
            name: i18n.t('Daily precipitation forecast'),
            color: '#B19CD8',
            zIndex: 2,
        });
    }

    console.log('Final series config:', seriesConfig);

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
        series: seriesConfig, // ✅ Updated series configuration,
    }
}

export default getChart
