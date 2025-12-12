import i18n from '@dhis2/d2-i18n'
import { landcoverTypes } from '../components/explore/landcover/LandcoverSelect.jsx'
import {
    kelvinToCelsius,
    getRelativeHumidity,
    roundOneDecimal,
    roundTwoDecimals,
} from '../utils/calc.js'
import {
    HOURLY,
    DAILY,
    WEEKLY,
    MONTHLY,
    SIXTEEN_DAYS,
    YEARLY,
} from '../utils/time.js'
import {
    climateDataSet,
    climateGroup,
    environmentDataSet,
    environmentGroup,
    landDataSet,
    landGroup,
} from './groupings.js'
import { getLegend } from './heat-stress-legend.js'
import { PROVIDER_GEE, dataProviders } from './providers.js'

// fetch provider metadata for GEE
const provider = dataProviders.find((item) => item.id === PROVIDER_GEE)

// kelvin to celsius with one decimal
const temperatureParser = (v) => roundOneDecimal(kelvinToCelsius(v)).toString()

const relativeHumidityParser = ([dewData, tempData]) =>
    tempData.map((temp, i) => ({
        ...temp,
        value: roundOneDecimal(
            getRelativeHumidity(
                kelvinToCelsius(temp.value),
                kelvinToCelsius(dewData[i].value)
            )
        ).toString(),
    }))

// meter to mm without scientific notation
// https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
const precipitationParser = (v) =>
    (v * 1000).toLocaleString('fullwide', {
        useGrouping: false,
    })

const vegetationIndexParser = (v) => roundTwoDecimals(v * 0.0001).toString()

const twoDecimals = (v) => roundTwoDecimals(v).toString()

const era5Source = 'ERA5-Land / Copernicus Climate Change Service'
const era5HeatSource = 'ERA5-Heat / Copernicus Climate Change Service'
const chirpsSource = 'Climate Hazards Center / UCSB'
const modisSource = 'NASA LP DAAC at the USGS EROS Center'
const demSource = 'NASA / USGS / JPL-Caltech'

export const ERA5_RESOLUTION = 'ERA5_RESOLUTION'
export const ERA5_LAND_RESOLUTION = 'ERA5_LAND_RESOLUTION'
export const CHIRPS_RESOLUTION = 'CHIRPS_RESOLUTION'
export const MODIS_RESOLUTION = 'MODIS_RESOLUTION'
export const LANDCOVER_RESOLUTION = 'LANDCOVER_RESOLUTION'
export const DEM_RESOLUTION = 'DEM_RESOLUTION'

export const getResolutionText = (resolution) => {
    const resolutions = {
        [ERA5_RESOLUTION]: i18n.t('Approximately 31 km (0.25°)'),
        [ERA5_LAND_RESOLUTION]: i18n.t('Approximately 9 km (0.1°)'),
        [CHIRPS_RESOLUTION]: i18n.t('Approximately 5 km (0.05°)'),
        [MODIS_RESOLUTION]: i18n.t('Approximately 250 m'),
        [LANDCOVER_RESOLUTION]: i18n.t('Approximately 500 m'),
        [DEM_RESOLUTION]: i18n.t('Approximately 30 m'),
    }
    return resolutions[resolution]
}

export const ndviDescription = i18n.t(
    'Landsat Normalized Difference Vegetation Index (NDVI) is used to quantify vegetation greenness and is useful in understanding vegetation density and assessing changes in plant health. NDVI values range from -1 to 1, with higher values indicating denser vegetation.'
)

export const eviDescription = i18n.t(
    'Enhanced vegetation index (EVI) differs from NDVI by reducing the influence of atmospheric conditions and canopy background noise. EVI values range from -1 to 1, with higher values indicating denser vegetation.'
)

export const landcoverDescription = i18n.t(
    'Land cover types at yearly intervals'
)

const getEEDatasets = () => [
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Air temperature (ERA5-Land)'),
        shortName: i18n.t('Air temperature'),
        description: i18n.t(
            'Average air temperature in °C at 2 m above the surface.'
        ),
        source: era5Source,
        resolution: ERA5_LAND_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'temperature_2m',
        reducer: 'mean',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'temperature_2m',
            periodType: HOURLY,
            periodReducer: 'mean',
        },
        valueParser: temperatureParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'ERA5_LAND_TEMPERATURE',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        provider,
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_max',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Max air temperature (ERA5-Land)'),
        shortName: i18n.t('Max air temperature'),
        description: i18n.t(
            'Maximum air temperature in °C at 2 m above the surface.'
        ),
        source: era5Source,
        resolution: ERA5_LAND_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'temperature_2m_max',
        reducer: 'max',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'temperature_2m',
            periodType: 'hourly',
            periodReducer: 'max',
        },
        valueParser: temperatureParser,
        aggregationType: i18n.t('Max'),
        dataElementCode: 'ERA5_LAND_TEMPERATURE_MAX',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        provider,
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_min',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Min temperature (ERA5-Land)'),
        shortName: i18n.t('Min air temperature'),
        description: i18n.t(
            'Minimum air temperature in °C at 2 m above the surface.'
        ),
        source: era5Source,
        resolution: ERA5_LAND_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'temperature_2m_min',
        reducer: 'min',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'temperature_2m',
            periodType: HOURLY,
            periodReducer: 'min',
        },
        valueParser: temperatureParser,
        aggregationType: i18n.t('Min'),
        dataElementCode: 'ERA5_LAND_TEMPERATURE_MIN',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        provider,
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Precipitation (ERA5-Land)'),
        shortName: i18n.t('Precipitation (ERA5)'),
        description: i18n.t('Total precipitation in mm.'),
        source: era5Source,
        resolution: ERA5_LAND_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'total_precipitation_sum',
        reducer: 'mean',
        periodReducer: 'sum',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'total_precipitation',
            periodType: HOURLY,
            periodReducer: 'sum',
        },
        valueParser: precipitationParser,
        aggregationType: i18n.t('Sum'),
        dataElementCode: 'ERA5_LAND_PRECIPITATION',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        provider,
    },
    {
        id: 'UCSB-CHG/CHIRPS/DAILY',
        datasetId: 'UCSB-CHG/CHIRPS/DAILY',
        name: i18n.t('Precipitation (CHIRPS)'),
        shortName: i18n.t('Precipitation (CHIRPS)'),
        description: i18n.t('Precipitation in mm.'),
        source: chirpsSource,
        resolution: CHIRPS_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'precipitation',
        reducer: 'mean',
        periodReducer: 'sum',
        valueParser: twoDecimals,
        aggregationType: i18n.t('Sum'),
        dataElementCode: 'CHIRPS_PRECIPITATION',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        provider,
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/dewpoint_temperature_2m',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Dewpoint temperature (ERA5-Land)'),
        shortName: i18n.t('Dewpoint temperature'),
        description: i18n.t(
            'Temperature in °C at 2 m above the surface to which the air would have to be cooled for saturation to occur.'
        ),
        source: era5Source,
        resolution: ERA5_LAND_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'dewpoint_temperature_2m',
        reducer: 'mean',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'dewpoint_temperature_2m',
            periodType: HOURLY,
            periodReducer: 'mean',
        },
        valueParser: temperatureParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'ERA5_LAND_DEWPOINT_TEMPERATURE',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        provider,
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/relative_humidity_2m',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Relative humidity (ERA5-Land)'),
        shortName: i18n.t('Relative humidity'),
        description: i18n.t(
            'Percentage of water vapor in the air compared to the total amount of vapor that can exist in the air at its current temperature. Calculated using air temperature and dewpoint temperature at 2 m above surface.'
        ),
        source: era5Source,
        resolution: ERA5_LAND_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        bands: [
            {
                band: 'dewpoint_temperature_2m',
                reducer: 'mean',
                timeZone: {
                    datasetId: 'ECMWF/ERA5_LAND/HOURLY',
                    band: 'dewpoint_temperature_2m',
                    periodType: HOURLY,
                    periodReducer: 'mean',
                },
            },
            {
                band: 'temperature_2m',
                reducer: 'mean',
                timeZone: {
                    datasetId: 'ECMWF/ERA5_LAND/HOURLY',
                    band: 'temperature_2m',
                    periodType: HOURLY,
                    periodReducer: 'mean',
                },
            },
        ],
        bandsParser: relativeHumidityParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'ERA5_LAND_RELATIVE_HUMIDITY',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        provider,
    },
    {
        id: 'projects/climate-engine-pro/assets/ce-era5-heat/utci_mean',
        datasetId: 'projects/climate-engine-pro/assets/ce-era5-heat',
        name: i18n.t('Heat stress (ERA5-HEAT)'),
        shortName: i18n.t('Heat stress'),
        description: i18n.t('Average felt temperature in °C.'),
        source: era5HeatSource,
        resolution: ERA5_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'utci_mean',
        reducer: 'mean',
        valueParser: temperatureParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'ERA5_HEAT_UTCI',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        legend: getLegend,
        provider,
    },
    {
        id: 'projects/climate-engine-pro/assets/ce-era5-heat/utci_max',
        datasetId: 'projects/climate-engine-pro/assets/ce-era5-heat',
        name: i18n.t('Max heat stress (ERA5-HEAT)'),
        shortName: i18n.t('Max heat stress'),
        description: i18n.t('Maximum felt temperature in °C.'),
        source: era5HeatSource,
        resolution: ERA5_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'utci_max',
        reducer: 'max',
        valueParser: temperatureParser,
        aggregationType: i18n.t('Max'),
        dataElementCode: 'ERA5_HEAT_UTCI_MAX',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        legend: getLegend,
        provider,
    },
    {
        id: 'projects/climate-engine-pro/assets/ce-era5-heat/utci_min',
        datasetId: 'projects/climate-engine-pro/assets/ce-era5-heat',
        name: i18n.t('Min heat stress (ERA5-HEAT)'),
        shortName: i18n.t('Min heat stress'),
        description: i18n.t('Minimum felt temperature in °C.'),
        source: era5HeatSource,
        resolution: ERA5_RESOLUTION,
        periodType: DAILY,
        supportedPeriodTypes: [DAILY, WEEKLY, MONTHLY],
        band: 'utci_min',
        reducer: 'min',
        valueParser: temperatureParser,
        aggregationType: i18n.t('Min'),
        dataElementCode: 'ERA5_HEAT_UTCI_MIN',
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        legend: getLegend,
        provider,
    },
    {
        id: 'MODIS/061/MOD13Q1/NDVI',
        datasetId: 'MODIS/061/MOD13Q1',
        name: i18n.t('NDVI - Normalized difference vegetation index (MODIS)'),
        shortName: i18n.t('NDVI'),
        description: ndviDescription,
        source: modisSource,
        resolution: MODIS_RESOLUTION,
        periodType: SIXTEEN_DAYS,
        supportedPeriodTypes: [WEEKLY, MONTHLY],
        band: 'NDVI',
        reducer: 'mean',
        valueParser: vegetationIndexParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'MODIS_NDVI',
        dataElementGroup: environmentGroup,
        dataSet: environmentDataSet,
        provider,
    },
    {
        id: 'MODIS/061/MOD13Q1/EVI',
        datasetId: 'MODIS/061/MOD13Q1',
        name: i18n.t('EVI - Enhanced vegetation index (MODIS)'),
        shortName: i18n.t('EVI'),
        description: eviDescription,
        source: modisSource,
        resolution: MODIS_RESOLUTION,
        periodType: SIXTEEN_DAYS,
        supportedPeriodTypes: [WEEKLY, MONTHLY],
        band: 'EVI',
        reducer: 'mean',
        valueParser: vegetationIndexParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'MODIS_EVI',
        dataElementGroup: environmentGroup,
        dataSet: environmentDataSet,
        provider,
    },
    {
        id: 'USGS/SRTMGL1_003/mean',
        datasetId: 'USGS/SRTMGL1_003',
        name: i18n.t('Mean elevation (SRTM)'),
        shortName: i18n.t('Mean elevation'),
        description: i18n.t('Mean elevation in meters above sea level.'),
        source: demSource,
        resolution: DEM_RESOLUTION,
        periodType: 'N/A',
        supportedPeriodTypes: [YEARLY],
        period: '2000',
        band: 'elevation',
        reducer: 'mean',
        valueParser: Math.round,
        aggregationType: i18n.t('First value'),
        dataElementCode: 'SRTM_ELEVATION_MEAN',
        dataElementGroup: landGroup,
        dataSet: landDataSet,
        provider,
    },
    {
        id: 'USGS/SRTMGL1_003/min',
        datasetId: 'USGS/SRTMGL1_003',
        name: i18n.t('Min elevation (SRTM)'),
        shortName: i18n.t('Min elevation'),
        description: i18n.t('Min elevation in meters above sea level.'),
        source: demSource,
        resolution: DEM_RESOLUTION,
        periodType: 'N/A',
        supportedPeriodTypes: [YEARLY],
        period: '2000',
        band: 'elevation',
        reducer: 'min',
        valueParser: Math.round,
        aggregationType: i18n.t('First value'),
        dataElementCode: 'SRTM_ELEVATION_MIN',
        dataElementGroup: landGroup,
        dataSet: landDataSet,
        provider,
    },
    {
        id: 'USGS/SRTMGL1_003/max',
        datasetId: 'USGS/SRTMGL1_003',
        name: i18n.t('Max elevation (SRTM)'),
        shortName: i18n.t('Max elevation'),
        description: i18n.t('Max elevation in meters above sea level.'),
        source: demSource,
        resolution: DEM_RESOLUTION,
        periodType: 'N/A',
        supportedPeriodTypes: [YEARLY],
        period: '2000',
        band: 'elevation',
        reducer: 'max',
        valueParser: Math.round,
        aggregationType: i18n.t('First value'),
        dataElementCode: 'SRTM_ELEVATION_MAX',
        dataElementGroup: landGroup,
        dataSet: landDataSet,
        provider,
    },
    {
        id: 'USGS/SRTMGL1_003/stddev',
        datasetId: 'USGS/SRTMGL1_003',
        name: i18n.t('Standard deviation of elevation (SRTM)'),
        shortName: i18n.t('Std dev elevation'),
        description: i18n.t(
            'Standard deviation of elevation in meters above sea level.'
        ),
        source: demSource,
        resolution: DEM_RESOLUTION,
        periodType: 'N/A',
        supportedPeriodTypes: [YEARLY],
        period: '2000',
        band: 'elevation',
        reducer: 'stdDev',
        valueParser: Math.round,
        aggregationType: i18n.t('First value'),
        dataElementCode: 'SRTM_ELEVATION_STDDEV',
        dataElementGroup: landGroup,
        dataSet: landDataSet,
        provider,
    },
    ...landcoverTypes.map(({ name, value }) => ({
        id: `MODIS/061/MCD12Q1/LC_Type1/${value}`,
        datasetId: 'MODIS/061/MCD12Q1',
        name: `${name} (MODIS)`,
        shortName: name,
        description: i18n.t('Percentage of area with this land cover type.'),
        source: modisSource,
        resolution: LANDCOVER_RESOLUTION,
        periodType: YEARLY,
        supportedPeriodTypes: [YEARLY],
        periodRange: {
            start: '2002',
            end: '2023',
        },
        band: 'LC_Type1',
        reducer: 'frequencyHistogram',
        histogramKey: value,
        valueParser: twoDecimals,
        aggregationType: i18n.t('Average'),
        dataElementCode: `MODIS_LANDCOVER_${value}`,
        dataElementGroup: landGroup,
        dataSet: landDataSet,
        provider,
    })),
]

const era5band = [
    'temperature_2m',
    'temperature_2m_min',
    'temperature_2m_max',
    'dewpoint_temperature_2m',
    'total_precipitation_sum',
]

export const era5Daily = {
    datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
    band: era5band,
    // reducer: ["mean", "min", "max", "mean", "mean"],
    reducer: 'mean', // Use mean to reduce outlier effect
    resolution: ERA5_LAND_RESOLUTION,
}

export const era5Monthly = {
    datasetId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    band: era5band,
    resolution: ERA5_LAND_RESOLUTION,
}

export const era5MonthlyNormals = {
    datasetId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    band: [
        'temperature_2m',
        'dewpoint_temperature_2m',
        'total_precipitation_sum',
    ],
    resolution: ERA5_LAND_RESOLUTION,
}

export const era5MonthlyTemperatures = {
    datasetId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    band: ['temperature_2m'],
    resolution: ERA5_LAND_RESOLUTION,
}

export const era5HeatDaily = {
    datasetId: 'projects/climate-engine-pro/assets/ce-era5-heat',
    band: ['utci_mean', 'utci_min', 'utci_max'],
    reducer: ['mean', 'min', 'max'],
    periodType: DAILY,
    resolution: ERA5_RESOLUTION,
}

export const era5HeatMonthly = {
    ...era5HeatDaily,
    aggregationPeriod: MONTHLY,
}

export default getEEDatasets
