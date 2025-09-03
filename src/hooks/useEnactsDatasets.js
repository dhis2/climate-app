import i18n from '@dhis2/d2-i18n'
import { useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import useRoutesAPI from "./useRoutesAPI";
import dataProviders from "../data/providers";
import { HOURLY, DAILY, WEEKLY, MONTHLY, SIXTEEN_DAYS, YEARLY } from '../utils/time.js'
import {
    climateDataSet,
    climateGroup,
} from '../data/groupings.js'

const dataProvider = dataProviders.find(item => item.id == 'enacts')
const routeCode = dataProvider['routeCode']

const enactsDataCollections = {
    ALL: {
        name: 'All stations',
        description: 'This type of dataset is for comprehensive analysis and only generated once the full set of all available stations at the MetServices becomes available (synoptic, climatological, agro, rain gauge, AWS).',
    },
    MON: {
        name: 'Monitoring',
        description: 'This type of dataset is for monitoring purposes and is generated using a subset of only those station data that have been made available at a given time.',
    },
    CLM: {
        name: 'Climatology',
        description: 'This type of dataset is generated using a subset of stations having a long series of data (at least 15 years of observation data).',
    },
}

const enactsAggregations = {
    precip: i18n.t('Sum'),
    tmin: i18n.t('Min'),
    tmax: i18n.t('Max'),
}

const parsePeriodType = (periodType) => {
    // convert enacts period types to internal period type names
    return {
        daily: DAILY,
        monthly: MONTHLY,
        annual: YEARLY
    }[periodType]
}

const parseVariableName = (variableName) => {
    // enacts datasets include periodtype as part of the variable name, so we strip it away
    const firstSpaceIndex = variableName.indexOf(" ")
    const nameStripped = variableName.slice(firstSpaceIndex + 1)
    const titleCased = nameStripped.charAt(0).toUpperCase() + nameStripped.slice(1)
    return titleCased
}

const parseEnactsDataset = (d) => {
    // Note: enacts uses different terminology
    // "dataset" for collections of datasets, eg All stations or Monitoring
    // and "variable" for dataset, eg precip
    console.log('parsing enacts dataset', d)
    const collection = enactsDataCollections[d.dataset_name]
    const datasetName = parseVariableName(d.variable_longname)
    const parsed = {
        id: `${d.dataset_name}-${d.variable_name}`,
        name: `${collection.name} - ${datasetName}`,
        shortName: `${datasetName}`,
        description: `${datasetName} measured in ${d.variable_units}. ${collection.description}`,
        units: d.variable_units,
        periodType: parsePeriodType(d.temporal_resolution),
        temporalAggregation: 'mean', // TODO: how to determine, maybe not allowed?...
        spatialAggregation: 'mean', // TODO: how to determine, maybe not allowed?...
        resolution: `${d.spatial_resolution.lon} degrees x ${d.spatial_resolution.lat} degrees`,
        variable: d.variable_name,
        source: 'Malawi Department of Climate Change and Meteorological Services', // TODO: This is hardcoded for now, need a way so users can define this themselves
        dataElementCode: `ENACTS_${d.dataset_name.toUpperCase()}_${d.variable_name.toUpperCase()}`,
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        aggregationType: enactsAggregations[d.variable_name],
        provider: dataProvider, // nested dict
    }
    if (parsed.periodType == YEARLY) {
        parsed.minYear = parseInt(d.temporal_coverage.start)
        parsed.maxYear = parseInt(d.temporal_coverage.end)
    }
    return parsed
}

const useEnactsDatasets = () => {
    // check and get enacts url from route api
    const { routes, loading: routesLoading, error: routesError } = useRoutesAPI()
    const enactsRoute = (!routesLoading && !routesError)
        ? routes.find(route => route.code == routeCode)
        : null
    if (!routesLoading && !routesError && !enactsRoute) {
        // means the route has simply not been set, only silently warn in the console
        console.warn(`Could not find a route with the code "${routeCode}"`)
    }

    // fetch raw datasets info from server
    const datasetsUrl = enactsRoute ? `${enactsRoute.href}/run/dataset_info` : null;

    const fetchDatasetsRaw = async () => {
        console.log('fetching enacts datasets', datasetsUrl)
        try {
            const resp = await fetch(datasetsUrl, {credentials: 'include'}) // needed to pass on dhis2 login credentials
            if (!resp.ok) {
                throw new Error(`ENACTS server returned HTTP error at ${datasetsUrl}: ${resp.status} - ${resp.statusText}`);
            }
            return resp.json()
        } catch (error) {
            // error could be network failure, CORS, or something else
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error(`Failed to fetch ENACTS datasets from ${datasetsUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`);
            } else {
                console.error(error)
                throw new Error(`Failed to fetch ENACTS datasets from ${datasetsUrl}: ${error}`)
            }
        }
    }

    const { data: queryData, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['use-enacts-datasets'],
        queryFn: fetchDatasetsRaw,
        enabled: !!datasetsUrl, // <-- only run query when URL is ready
    })

    // process results
    const processedData = useMemo(() => {
        if (!queryData) return undefined

        console.log('processing list of enacts datasets', queryData)

        // convert nested structures to get flat list of datasets
        const flatData = [];
        Object.entries(queryData).forEach(([dataType, periodGroups]) => {
            // enacts has a separate dataset for each time period of each variable
            // instead only get the datasets/variables for a single period (daily)
            // and allow user to select period type in frontend (assumes all datasets
            // also exists at higher tempoeral aggregations)
            Object.entries(periodGroups.daily).forEach(([variable, dataInfo]) => {
                flatData.push(dataInfo)
            })
        });

        // parse to expected dataset dict
        const parsedData = flatData.map(parseEnactsDataset)

        // filter to only supported/parseable period types
        return parsedData.filter((d) => d.periodType != undefined)
    }, [queryData])

    // return
    const error = routesError || queryError

    const loading = enactsRoute && (routesLoading || queryLoading) && !error

    console.log('useEnactsDatasets final', processedData, loading, error)

    return {data: processedData, error, loading}
}

export default useEnactsDatasets;