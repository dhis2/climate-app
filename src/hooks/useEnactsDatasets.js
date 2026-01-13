import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
    useDataSources,
    enactsProvider,
} from '../components/DataSourcesProvider.jsx'
import { climateDataSet, climateGroup } from '../data/groupings.js'
import { DAILY, MONTHLY, YEARLY } from '../utils/time.js'

const EMPTY_ENACTS_DATASETS = []

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

const parseEnactsDatasetGroup = (datasets, enactsInfo) => {
    // Take an entire group of enacts dataset dicts, one for each period type.
    // Parse them into a single dataset entry for all available period types (eg daily, monthly).

    // Note: enacts uses different terminology
    // "dataset" for collections of datasets, eg All stations or Monitoring
    // and "variable" for dataset, eg precip

    // create list of available period types and time ranges based on each of the provided datasets
    const supportedPeriodTypes = []
    for (const dataset of datasets) {
        const periodEntry = {
            periodType: parsePeriodType(dataset.temporal_resolution),
            periodRange: parsePeriodRange(dataset.temporal_coverage),
        }
        supportedPeriodTypes.push(periodEntry)
    }

    // use the first dataset as the basis for all other dataset metadata
    // ie should be the same for the different period types
    const d = datasets[0]
    const collection = enactsDataCollections[d.dataset_name]
    const datasetName = parseVariableName(d.variable_longname)
    const parsed = {
        id: `${d.dataset_name}-${d.variable_name}`,
        name: `${collection.name} - ${datasetName}`,
        shortName: `${datasetName}`,
        description: `${datasetName} measured in ${d.variable_units}. ${collection.description}`,
        units: d.variable_units,
        supportedPeriodTypes: supportedPeriodTypes, // list of period objects including time range, see further up
        resolution: d.spatial_resolution.lon,
        resolutionText: i18n.t(
            'Data resolution is approximately {{resolution}} degrees.',
            {
                resolution: d.spatial_resolution.lon,
            }
        ),
        variable: d.variable_name,
        source: enactsInfo.owner, // retrieved from the enacts server metadata
        dataElementCode: `ENACTS_${d.dataset_name.toUpperCase()}_${d.variable_name.toUpperCase()}`,
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        aggregationType: null, // we don't know which datasets will be returned so can't map or assume any aggregation types
        provider: enactsProvider, // nested dict
    }
    return parsed
}

const useEnactsDatasets = () => {
    const { enacts } = useDataSources()
    const enactsInfo = enacts.info
    const enactsRoute = enacts.route

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
            return EMPTY_ENACTS_DATASETS
        }

        // Flatten daily and monthly datasets into a single array
        const allDatasets = Object.values(queryData).flatMap((periodGroups) =>
            ['daily', 'monthly'].flatMap((periodType) =>
                Object.values(periodGroups[periodType])
            )
        )

        // Group datasets by groupId
        const datasetGroupLookup = allDatasets.reduce((lookup, d) => {
            const groupId = `${d.dataset_name}-${d.variable_name}`
            if (lookup[groupId]) {
                lookup[groupId].push(d)
            } else {
                lookup[groupId] = [d]
            }
            return lookup
        }, {})

        // parse each group of datasets to expected dataset dict
        const datasetListOfGroups = Object.values(datasetGroupLookup)

        const parsedData = datasetListOfGroups.map((datasetGroup) =>
            parseEnactsDatasetGroup(datasetGroup, enactsInfo)
        )

        // filter to only supported/parseable period types
        return parsedData.filter(
            (d) =>
                Array.isArray(d.supportedPeriodTypes) &&
                d.supportedPeriodTypes.some((pt) => pt.periodType !== undefined)
        )
    }, [queryData, enactsInfo])

    const error = !!enacts.error || !!queryError

    return {
        data: processedData,
        loading: enactsRoute && queryLoading && !error,
        error,
    }
}

export default useEnactsDatasets
