import { useConfig } from '@dhis2/app-runtime'
import { useSetting } from '@dhis2/app-service-datastore'
import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { Button, IconLaunch16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import useUserLocale from '../../hooks/useUserLocale.js'

export const MAPS_APP_URL = 'dhis-web-maps'
export const USER_DATASTORE_NAMESPACE = 'analytics'
export const USER_DATASTORE_CURRENT_AO_KEY = 'currentAnalyticalObject'

const EE_DATASETS_MAPPING = {
    ['elevation']: { layerId: 'USGS/SRTMGL1_003', band: 'elevation' },
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
        layerId: 'MODIS/061/MOD13Q1/VI/MONTHLY',
        band: 'NDVI',
    },
    ['EVI']: {
        layerId: 'MODIS/061/MOD13Q1/VI/MONTHLY',
        band: 'EVI',
    },
}

const thisYear = String(new Date().getFullYear())

const OpenAsMapButton = ({
    dataset,
    period = { endTime: thisYear },
    feature,
}) => {
    const [, /* actual value not used */ { set }] = useSetting(
        USER_DATASTORE_CURRENT_AO_KEY
    )

    const { baseUrl, systemInfo = {} } = useConfig()
    const { locale } = useUserLocale()
    const fixedPeriod = createFixedPeriodFromPeriodId({
        periodId: period.endTime.replaceAll('-', ''),
        calendar: systemInfo.calendar,
        locale,
    })

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
                                id: fixedPeriod.id,
                                name: fixedPeriod.name.replaceAll(
                                    /\b\w/g,
                                    (char) => char.toUpperCase()
                                ),
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
    period: PropTypes.object,
}

export default OpenAsMapButton
