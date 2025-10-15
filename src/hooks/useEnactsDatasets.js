import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { climateDataSet, climateGroup } from '../data/groupings.js'
import { dataProviders, PROVIDER_ENACTS } from '../data/providers.js'
import { DAILY, MONTHLY, YEARLY } from '../utils/time.js'
import useEnactsInfo from './useEnactsInfo.js'
import useRoutesAPI from './useRoutesAPI.js'

const dataProvider = dataProviders.find((item) => item.id == PROVIDER_ENACTS)
const routeCode = dataProvider['routeCode']

const enactsDataCollections = {
    ALL: {
        name: 'All stations',
        description:
            'This type of dataset is for comprehensive analysis and only generated once the full set of all available stations at the MetServices becomes available (synoptic, climatological, agro, rain gauge, AWS).',
    },
    MON: {
        name: 'Monitoring',
        description:
            'This type of dataset is for monitoring purposes and is generated using a subset of only those station data that have been made available at a given time.',
    },
    CLM: {
        name: 'Climatology',
        description:
            'This type of dataset is generated using a subset of stations having a long series of data (at least 15 years of observation data).',
    },
}

const parsePeriodType = (periodType) => {
    // convert enacts period types to internal period type names
    return {
        daily: DAILY,
        monthly: MONTHLY,
        annual: YEARLY,
    }[periodType]
}

const parsePeriodRange = (periodRange) => {
    // convert enacts period range to internal period range format
    return { start: periodRange.start, end: periodRange.end }
}

const parseVariableName = (variableName) => {
    // enacts datasets include periodtype as part of the variable name, so we strip it away
    const firstSpaceIndex = variableName.indexOf(' ')
    const nameStripped = variableName.slice(firstSpaceIndex + 1)
    const titleCased =
        nameStripped.charAt(0).toUpperCase() + nameStripped.slice(1)
    return titleCased
}

const parseEnactsDataset = (d, enactsInfo) => {
    console.log('jj parseEnactsDataset d', d)
    // Note: enacts uses different terminology
    // "dataset" for collections of datasets, eg All stations or Monitoring
    // and "variable" for dataset, eg precip
    const collection = enactsDataCollections[d.dataset_name]
    const datasetName = parseVariableName(d.variable_longname)
    const parsed = {
        id: `${d.dataset_name}-${d.variable_name}`,
        name: `${collection.name} - ${datasetName}`,
        shortName: `${datasetName}`,
        description: `${datasetName} measured in ${d.variable_units}. ${collection.description}`,
        units: d.variable_units,
        periodType: parsePeriodType(d.temporal_resolution),
        supportedPeriodTypes: [DAILY, MONTHLY],
        periodRange: parsePeriodRange(d.temporal_coverage),
        resolution: `${d.spatial_resolution.lon} degrees x ${d.spatial_resolution.lat} degrees`, // TODO - i18n?
        variable: d.variable_name,
        source: enactsInfo.owner, // retrieved from the enacts server metadata
        dataElementCode: `ENACTS_${d.dataset_name.toUpperCase()}_${d.variable_name.toUpperCase()}`,
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        aggregationType: null, // we don't know which datasets will be returned so can't map or assume any aggregation types
        provider: dataProvider, // nested dict
    }
    return parsed
}

const useEnactsDatasets = () => {
    const {
        routes,
        loading: routesLoading,
        error: routesError,
    } = useRoutesAPI()

    const enactsRoute =
        !routesLoading && !routesError
            ? routes.find((route) => route.code == routeCode)
            : null
    if (!routesLoading && !routesError && !enactsRoute) {
        console.warn(`Could not find a route with the code "${routeCode}"`)
    }

    const {
        data: enactsInfo,
        loading: enactsInfoLoading,
        error: enactsInfoError,
    } = useEnactsInfo(enactsRoute)

    // fetch raw datasets info from server
    const datasetsUrl = enactsRoute
        ? `${enactsRoute.href}/run/dataset_info`
        : null

    const fetchDatasetsRaw = async () => {
        try {
            const resp = await fetch(datasetsUrl, { credentials: 'include' })
            if (!resp.ok) {
                throw new Error(
                    `ENACTS server returned HTTP error at ${datasetsUrl}: ${resp.status} - ${resp.statusText}`
                )
            }
            return resp.json()
        } catch (error) {
            // error could be network failure, CORS, or something else
            if (
                error instanceof TypeError &&
                error.message === 'Failed to fetch'
            ) {
                throw new Error(
                    `Failed to fetch ENACTS datasets from ${datasetsUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`
                )
            } else {
                console.error(error)
                throw new Error(
                    `Failed to fetch ENACTS datasets from ${datasetsUrl}: ${error}`
                )
            }
        }
    }

    const {
        data: queryData,
        isLoading: queryLoading,
        error: queryError,
    } = useQuery({
        queryKey: ['use-enacts-datasets'],
        queryFn: fetchDatasetsRaw,
        enabled: !!datasetsUrl && !!enactsInfo,
    })

    // process results
    const processedData = useMemo(() => {
        if (!queryData || !enactsInfo) {
            return undefined
        }

        // convert nested structures to get flat list of datasets
        const flatData = []

        // enacts has a separate dataset for each time period of each variable
        // instead only get the datasets/variables for a single period (daily)
        // and allow user to select period type in frontend (assumes all datasets
        // also exist at higher temporal aggregations)
        for (const [, periodGroups] of Object.entries(queryData)) {
            for (const [, dataInfo] of Object.entries(periodGroups.daily)) {
                flatData.push(dataInfo)
            }
        }

        // parse to expected dataset dict
        const parsedData = flatData.map((d) =>
            parseEnactsDataset(d, enactsInfo)
        )

        // filter to only supported/parseable period types
        return parsedData.filter((d) => d.periodType != undefined)
    }, [queryData, enactsInfo])

    const error = routesError || enactsInfoError || queryError

    const loading =
        enactsRoute &&
        (routesLoading || enactsInfoLoading || queryLoading) &&
        !error

    return { data: processedData, error, loading }
}

export default useEnactsDatasets
