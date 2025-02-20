import i18n from '@dhis2/d2-i18n';
import { colors } from '@dhis2/ui';
import { getTimeFromId, metersToMillimeters } from '../../../../utils/calc.js';
import {
    animation,
    credits,
    getMonthlyPeriod,
    getMonthFromId,
} from '../../../../utils/chart.js';

const band = 'total_precipitation_sum';
const forecastBand = 'forecast_precipitation_sum';

const getChartConfig = ({ name, data, forecastData, normals, referencePeriod, settings }) => {
    const { precipMonthlyMax } = settings;

    // ✅ Historical precipitation data
    const series = data.map((d) => ({
        x: getTimeFromId(d.id),
        y: metersToMillimeters(d[band]),
    }));

    // ✅ Historical normals data
    const monthMormals = data.map((d) => {
        const month = getMonthFromId(d.id);
        const normal = normals.find((n) => n.id === month);

        return {
            x: getTimeFromId(d.id),
            y: metersToMillimeters(normal[band]),
        };
    });

    // ✅ Base series configuration
    const seriesConfig = [
        {
            data: series,
            name: i18n.t('Monthly precipitation'),
            color: colors.blue500,
            zIndex: 1,
        },
        {
            data: monthMormals,
            name: i18n.t('Normal precipitation'),
            color: colors.blue200,
            pointPlacement: -0.2,
            zIndex: 0,
        },
    ];

    // ✅ If forecastData exists, append forecast series & extend normals
    if (forecastData?.length > 0) {
        console.log('Adding forecast series:', forecastData);

        // Forecast precipitation series
        const forecastSeries = forecastData.map((d) => ({
            x: getTimeFromId(d.id),
            y: d[forecastBand], // TODO: currently the api returns in actual mm, so no conversion from meters needed, but should make this more flexible depending on the api... 
        })).sort((a, b) => a.x - b.x);

        // Forecast normals for future periods
        const forecastNormals = forecastData.map((d) => {
            const month = getMonthFromId(d.id);
            const normal = normals.find((n) => n.id === month);
            return {
                x: getTimeFromId(d.id),
                y: metersToMillimeters(normal[band]),
            };
        });

        // ✅ Append forecast normals to the existing normals series
        seriesConfig[1] = {
            ...seriesConfig[1],
            data: [...seriesConfig[1].data, ...forecastNormals].sort((a, b) => a.x - b.x),
        };

        // ✅ Add the forecast series
        seriesConfig.push({
            data: forecastSeries,
            name: i18n.t('Monthly precipitation forecast'),
            color: '#B19CD8',
            zIndex: 2,
        });
    }

    console.log('Final series config:', seriesConfig);

    return {
        title: {
            text: i18n.t('{{name}}: Monthly precipitation {{period}}', {
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
        tooltip: {
            shared: true,
            valueSuffix: ' mm',
        },
        chart: {
            type: 'column',
            height: 480,
            marginBottom: 75,
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
            tickInterval: 2592000000, // One month in milliseconds
            labels: {
                format: '{value: %b}',
            },
        },
        yAxis: {
            min: 0,
            max: precipMonthlyMax,
            title: false,
            labels: {
                format: '{value} mm',
            },
        },
        series: seriesConfig, // ✅ Updated series configuration
    };
};

export default getChartConfig;
