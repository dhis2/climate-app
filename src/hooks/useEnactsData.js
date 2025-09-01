import { useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import useRoutesAPI from "./useRoutesAPI";
import dataProviders from "../data/providers";
import { HOURLY, DAILY, WEEKLY, MONTHLY, SIXTEEN_DAYS, YEARLY } from '../utils/time.js'

const routeCode = dataProviders.find(item => item.id == 'enacts')['routeCode']

const parseEnactsData = (results) => {
    console.log('parsing enacts data', results)
    // need to convert from original enacts results
    // eg: Data.Name ie orgunit, Data.Values array, Dates which maps to values array, and Missing which can be used to convert to null
    // to structure expected by the climate app
    // ie: ou, period, value
    const parsed = []
    const dates = results.Dates
    const missing = results.Missing
    results.Data.map((item) => {
        const ou = item.Name // orgunit id
        const values = item.Values
        for (let i=0; i < values.length; i++) {
            const period = dates[i]
            const value = values[i] == missing ? NaN : values[i] // get value or NaN for missing
            // NOTE: NaN values are later filtered out and reported to the user
            parsed.push({ou, period, value})
        }
    })
    console.log('parsed', parsed)
    return parsed
}

const encodeTemporalRes = (periodType) => {
    // TODO: check that this is correct
    return periodType.toLowerCase()
}

const encodeDate = (date, periodType) => {
    // convert date from internal date format to format expected by enacts
    if (periodType == DAILY) {
        return date
    } else if (periodType == MONTHLY) {
        return date.slice(0, 7)
    } else if (periodType == YEARLY) {
        return date.slice(0, 5)
    } else {
        throw Error(`Period type ${periodType} not yet supported`)
    }
}

const useEnactsData = (dataset, period, features) => {
    // check and get enacts url from route api
    const { routes, loading: routesLoading, error: routesError } = useRoutesAPI()
    const enactsRoute = (!routesLoading && !routesError)
        ? routes.find(route => route.code == routeCode)
        : null
    if (!routesLoading && !routesError && !enactsRoute) {
        // means the route has not been set
        throw new Error(`Could not find a route with the code "${routeCode}"`)
    }

    // fetch raw data info from server
    const dataUrl = enactsRoute ? `${enactsRoute.href}/run/download_raw_data` : null;
    
    const fetchDataRaw = async () => {
        console.log('fetching enacts data', dataUrl)
        console.log('dataset to import', dataset)
        try {
            const resp = await fetch(dataUrl, {
                credentials: 'include', // needed to pass on dhis2 login credentials
                method : 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    //'X-API-Key': '......',
                },
                body : JSON.stringify({
                    dataset: dataset.id.slice(0, 3), // ENACTS dataset type is stored as the first 3 characters of the dataset id
                    variable: dataset.variable,
                    temporalRes: encodeTemporalRes(dataset.periodType),
                    startDate: encodeDate(period.startTime, dataset.periodType),
                    endDate: encodeDate(period.endTime, dataset.periodType),
                    geomExtract: 'geojson',
                    geojsonSource: 'upload',
                    geojsonData: {type: 'FeatureCollection', features: features},
                    geojsonField: 'id', // can we always expect this? 
                    outFormat: 'JSON-Format',
                })
            })
            if (!resp.ok) {
                throw new Error(`ENACTS server returned HTTP error at ${dataUrl}: ${resp.status} - ${resp.statusText}`);
            }
            const rawData = await resp.json()
            console.log('rawData', rawData)
            if ("code" in rawData && rawData.code !== 200) {
                // server returns error message
                throw new Error(`ENACTS server responded with an error message: ${rawData.code} - ${rawData.message}`);
            }
            return rawData
        } catch (error) {
            // error could be network failure, CORS, or something else
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error(`Failed to fetch ENACTS data from ${dataUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`);
            } else {
                console.error(error)
                throw new Error(`Failed to fetch ENACTS data from ${dataUrl}: ${error}`)
            }
        }
    }

    const { data: queryData, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['use-enacts-data', dataset, period, features],
        queryFn: fetchDataRaw,
        enabled: !!(
            dataUrl &&
            dataset &&
            period &&
            features?.length > 0
        )
    })

    // process results
    const processedData = useMemo(() => {
        if (!queryData) return undefined
        return parseEnactsData(queryData)
    }, [queryData])

    // return
    const error = routesError || queryError

    const loading = enactsRoute && (routesLoading || queryLoading) && !error

    console.log('useEnactsData final', processedData, loading, error)

    return {data: processedData, error, loading}
}

export default useEnactsData;