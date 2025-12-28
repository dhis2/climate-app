import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useDataSources } from '../components/DataSourcesProvider.jsx'
import { DAILY, MONTHLY, YEARLY } from '../utils/time.js'

const parseEnactsData = (results) => {
    // need to convert from original enacts results
    // eg: Data.Name ie orgunit, Data.Values array, Dates which maps to values array, and Missing which can be used to convert to NaN
    // to structure expected by the climate app
    // ie: ou, period, value
    const parsed = []
    const dates = results.Dates
    const missing = results.Missing
    results.Data.map((item) => {
        const ou = item.Name // orgunit id
        const values = item.Values
        for (let i = 0; i < values.length; i++) {
            const period = dates[i]
            const value = values[i] == missing ? Number.NaN : values[i] // get value or NaN for missing
            // NOTE: NaN values are later filtered out and reported to the user
            parsed.push({ ou, period, value })
        }
    })
    return parsed
}

const encodeTemporalRes = (periodType) => {
    // convert from internal period type format to format expected by enacts
    return {
        DAILY: 'daily',
        MONTHLY: 'monthly',
        YEARLY: 'annual',
    }[periodType]
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
        throw new Error(`Period type ${periodType} not yet supported`)
    }
}

const useEnactsData = (dataset, period, features) => {
    const { enactsRoute } = useDataSources()

    // fetch raw data info from server
    const dataUrl = enactsRoute
        ? `${enactsRoute.href}/run/download_raw_data`
        : null

    const fetchDataRaw = async () => {
        try {
            const resp = await fetch(dataUrl, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // TODO: document which DHIS2 version this is needed for
                },
                body: JSON.stringify({
                    dataset: dataset.id.slice(0, 3), // Note: ENACTS dataset type is stored as the first 3 characters of the dataset id
                    variable: dataset.variable,
                    temporalRes: encodeTemporalRes(period.periodType),
                    startDate: encodeDate(period.startTime, period.periodType),
                    endDate: encodeDate(period.endTime, period.periodType),
                    geomExtract: 'geojson',
                    geojsonSource: 'upload',
                    geojsonData: {
                        type: 'FeatureCollection',
                        features: features,
                    },
                    geojsonField: 'id',
                    outFormat: 'JSON-Format',
                }),
            })
            if (!resp.ok) {
                throw new Error(
                    `ENACTS server returned HTTP error at ${dataUrl}: ${resp.status} - ${resp.statusText}`
                )
            }
            const rawData = await resp.json()
            if (rawData?.status == -1) {
                // server returns error message
                throw new Error(
                    `ENACTS server responded with an error message code '${rawData?.code}': ${rawData.message}`
                )
            }
            return rawData
        } catch (error) {
            // error could be network failure, CORS, or something else
            if (
                error instanceof TypeError &&
                error.message === 'Failed to fetch'
            ) {
                throw new Error(
                    `Failed to fetch ENACTS data from ${dataUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`
                )
            } else {
                console.error(error)
                throw new Error(
                    `Failed to fetch ENACTS data from ${dataUrl}: ${error}`
                )
            }
        }
    }

    const {
        data: queryData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['use-enacts-data', dataset, period, features],
        queryFn: fetchDataRaw,
        enabled: !!(dataUrl && dataset && period && features?.length > 0),
    })

    // process results
    const processedData = useMemo(() => {
        if (!queryData) {
            return undefined
        }
        return parseEnactsData(queryData)
    }, [queryData])

    const loading = isLoading && !error

    return { data: processedData, error, loading }
}

export default useEnactsData
