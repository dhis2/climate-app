import { useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import useRoutesAPI from "./useRoutesAPI";

const routeCode = 'iri-enacts' // TODO: Probably need to define this more centrally. Needs to match the route code in the Routes API, and as set in SettingsPage.jsx in dataProviders = ...

const parseIriAggregateResults = (results) => {
    console.log('parsing iri data', results)
    // need to convert from original iri results
    // to structure expected by the climate app
    // ie: ou, period, value
    return results
}

const useIriData = (dataset, period, features) => {
    // check and get iri url from route api
    const { routes, loading: routesLoading, error: routesError } = useRoutesAPI()
    const iriRoute = (!routesLoading && !routesError)
        ? routes.find(route => route.code == routeCode)
        : null
    if (!routesLoading && !routesError && !iriRoute) {
        // means the route has not been set
        throw new Error(`Could not find a route with the code "${routeCode}"`)
    }

    // fetch raw data info from server
    const dataUrl = iriRoute ? `${iriRoute.href}/run/download_raw_data` : null;
    
    const fetchDataRaw = async () => {
        console.log('fetching iri data', dataUrl)
        console.log('dataset to import', dataset)
        //return dataIriTestOnly // testing only... 
        try {
            const resp = await fetch(dataUrl, {
                credentials: 'include', // needed to pass on dhis2 login credentials
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    variable: dataset.variable,
                    temporalRes: dataset.periodType, // need converting? 
                    startDate: period.startDate,
                    endDate: period.endDate,
                    geomExtract: 'geojson',
                    geojsonSource: 'upload',
                    geojsonData: {type: 'FeatureCollection', features},
                    geojsonField: 'id', // can we always expect this? 
                    outFormat: 'JSON-Format',
                })
            })
            if (!resp.ok) {
                throw new Error(`IRI server returned HTTP error at ${dataUrl}: ${resp.status} - ${resp.statusText}`);
            }
            const rawData = await resp.json()
            console.log('rawData', rawData)
            if ("code" in rawData && rawData.code !== 200) {
                // IRI server returns error message
                throw new Error(`IRI server responded with an error message: ${rawData.code} - ${rawData.message}`);
            }
            return rawData
        } catch (error) {
            // error could be network failure, CORS, or something else
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error(`Failed to fetch IRI data from ${dataUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`);
            } else {
                console.error(error)
                throw new Error(`Failed to fetch IRI data from ${dataUrl}: ${error}`)
            }
        }
    }

    const { data: queryData, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['use-iri-data'],
        queryFn: fetchDataRaw,
        enabled: !!dataUrl, // <-- only run query when URL is ready
    })

    // process results
    const processedData = useMemo(() => {
        if (!queryData) return undefined
        return parseIriAggregateResults(queryData)
    }, [queryData])

    // return
    const error = routesError || queryError

    const loading = iriRoute && (routesLoading || queryLoading) && !error

    console.log('useIriData final', processedData, loading, error)

    return {data: processedData, error, loading}
}

export default useIriData;