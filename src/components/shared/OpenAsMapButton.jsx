import { useConfig } from '@dhis2/app-runtime'
import { useSetting } from '@dhis2/app-service-datastore'
import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { Button, IconLaunch16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import useAppVersion from '../../hooks/useAppVersion.js'
import useUserLocale from '../../hooks/useUserLocale.js'

export const MAPS_APP_URL = 'dhis-web-maps'
export const USER_DATASTORE_NAMESPACE = 'analytics'
export const USER_DATASTORE_CURRENT_AO_KEY = 'currentAnalyticalObject'

const EE_DATASETS_MAPPING = {
    ['elevation']: { layerId: 'USGS/SRTMGL1_003', band: 'elevation' },
    ['landcover']: { layerId: 'MODIS/006/MCD12Q1', band: 'LC_Type1' },
    ['heatDaily']: {
        layerId: 'projects/climate-engine-pro/assets/ce-era5-heat/utci',
        band: 'utci_mean',
    },
    ['heatMonthly']: {
        layerId: 'projects/climate-engine-pro/assets/ce-era5-heat/utci/monthly',
        band: 'utci_mean',
    },
    ['temperatureDaily']: {
        layerId: 'ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m',
        band: 'temperature_2m',
    },
    ['temperatureMonthly']: {
        layerId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR/temperature_2m',
        band: 'temperature_2m',
    },
    ['precipitationDaily']: {
        layerId: 'ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum',
        band: 'total_precipitation_sum',
    },
    ['precipitationMonthly']: {
        layerId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR/total_precipitation_sum',
        band: 'total_precipitation_sum',
    },
    ['humidityDaily']: {
        layerId: 'ECMWF/ERA5_LAND/DAILY_AGGR/relative_humidity_2m',
        band: 'relative_humidity_2m',
    },
    ['humidityMonthly']: {
        layerId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR/relative_humidity_2m',
        band: 'relative_humidity_2m',
    },
    ['NDVI']: {
        layerId: 'MODIS/061/MOD13Q1/VI/16DAY',
        band: 'NDVI',
    },
    ['EVI']: {
        layerId: 'MODIS/061/MOD13Q1/VI/16DAY',
        band: 'EVI',
    },
}

const formatDate = (date, locale) =>
    new Intl.DateTimeFormat(locale.replace('_', '-'), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date)

const thisYear = String(new Date().getFullYear())

const OpenAsMapButton = ({
    dataset,
    period = { id: thisYear },
    feature,
    loading,
}) => {
    const [, /* actual value not used */ { set }] = useSetting(
        USER_DATASTORE_CURRENT_AO_KEY
    )

    const { meetsVersion } = useAppVersion('maps', '101.5.0')

    const { baseUrl, systemInfo = {} } = useConfig()
    const { locale } = useUserLocale()

    if (loading || !meetsVersion) {
        return (
            <Button disabled={true} primary>
                Open as Map&nbsp;
                <IconLaunch16 />
            </Button>
        )
    }

    let periodId, periodName
    switch (dataset) {
        case 'elevation':
            periodId = period.id.replaceAll('-', '_')
            periodName = ''
            break
        case 'landcover':
            periodId = period.id.replaceAll('-', '_')
            periodName = period.id.split('-')[0]
            break
        case 'NDVI':
        case 'EVI': {
            periodId = period.id.replaceAll('-', '_')
            const formattedStartDate = formatDate(period.startTime, locale)
            const formattedEndDate = formatDate(period.endTime, locale)
            periodName = `${formattedStartDate} - ${formattedEndDate}`
            break
        }
        default: {
            periodId = period.id.replaceAll('-', '')
            const fixedPeriod = createFixedPeriodFromPeriodId({
                periodId: periodId,
                calendar: systemInfo.calendar,
                locale,
            })
            periodName = fixedPeriod.name.replaceAll(/\b\w/g, (char) =>
                char.toUpperCase()
            )
        }
    }

    const handleOpenAsMapClick = async () => {
        const preparedAO = {
            ...EE_DATASETS_MAPPING[dataset],
            type: 'earthEngine',
            rows: [
                {
                    items: [
                        {
                            id: feature.id,
                            path: feature.path,
                            name: feature.properties.name,
                        },
                    ],
                    dimension: 'ou',
                },
            ],
            filters: [
                {
                    items: [
                        [
                            {
                                id: periodId,
                                name: periodName,
                                dimensionItemType: 'PERIOD',
                            },
                        ],
                    ],
                    dimension: 'pe',
                },
            ],
        }
        set(preparedAO)
        window.open(
            `${baseUrl}/${MAPS_APP_URL}/#/${USER_DATASTORE_CURRENT_AO_KEY}`,
            '_blank'
        )
    }

    return (
        <Button onClick={handleOpenAsMapClick} primary>
            Open as Map&nbsp;
            <IconLaunch16 />
        </Button>
    )
}

OpenAsMapButton.propTypes = {
    dataset: PropTypes.string,
    feature: PropTypes.object,
    loading: PropTypes.bool,
    period: PropTypes.object,
}

export default OpenAsMapButton
