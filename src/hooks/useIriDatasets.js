import { useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import useRoutesAPI from "./useRoutesAPI";

//import datasetsIriTestOnly from "../data/datasetsIriTestOnly"; // for testing only

const routeCode = 'iri-enacts' // TODO: Probably need to define this more centrally. Needs to match the route code in the Routes API, and as set in SettingsPage.jsx in dataProviders = ...

const parsePeriodType = (periodType) => {
    //return periodType // TODO: check what the valid period types should be
    return {
        daily: "DAILY",
        weekly: "WEEKLY",
        monthly: "MONTHLY",
        annual: "YEARLY"
    }[periodType]
}

const parseIriDataset = (d) => {
    console.log('parsing iri dataset', d)
    const parsed = {
        id: `${d.dataset_name}-${d.variable_name}-${d.temporal_resolution}`,
        name: `${d.variable_longname} (${d.dataset_longname})`,
        shortName: `${d.variable_longname}`,
        units: d.variable_units,
        periodType: parsePeriodType(d.temporal_resolution),
        temporalAggregation: 'mean', // how to determine, maybe not allowed?...
        spatialAggregation: 'mean', // how to determine, maybe not allowed?...
        resolution: `${d.spatial_resolution.lon} degrees x ${d.spatial_resolution.lat} degrees`,
        variable: d.variable_name,
        provider: 'iri',
        providerName: 'IRI ENACTS Data Sharing Tool (DST)',
        providerNameShort: 'IRI ENACTS',
        providerUrl: '<placeholder url...>', //`${apiUrl}`, // need a way to access the route url here
    }
    if (parsed.periodType == 'YEARLY') {
        parsed.minYear = parseInt(d.temporal_coverage.start)
        parsed.maxYear = parseInt(d.temporal_coverage.end)
    }
    return parsed
}

const useIriDatasets = () => {
    // check and get iri url from route api
    const { routes, loading: routesLoading, error: routesError } = useRoutesAPI()
    const iriRoute = (!routesLoading && !routesError)
        ? routes.find(route => route.code == routeCode)
        : null
    if (!routesLoading && !routesError && !iriRoute) {
        // means the route has simply not been set, only silently warn in the console
        console.warn(`Could not find a route with the code "${routeCode}"`)
    }

    // fetch raw datasets info from server
    const datasetsUrl = iriRoute ? `${iriRoute.href}/run/dataset_info` : null;

    const fetchDatasetsRaw = async () => {
        console.log('fetching iri datasets', datasetsUrl)
        //return datasetsIriTestOnly // testing only... 
        try {
            const resp = await fetch(datasetsUrl, {credentials: 'include'}) // needed to pass on dhis2 login credentials
            if (!resp.ok) {
                throw new Error(`IRI server returned HTTP error at ${datasetsUrl}: ${resp.status} - ${resp.statusText}`);
            }
            return resp.json()
        } catch (error) {
            // error could be network failure, CORS, or something else
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error(`Failed to fetch IRI datasets from ${datasetsUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`);
            } else {
                console.error(error)
                throw new Error(`Failed to fetch IRI datasets from ${datasetsUrl}: ${error}`)
            }
        }
    }

    const { data: queryData, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['use-iri-datasets'],
        queryFn: fetchDatasetsRaw,
        enabled: !!datasetsUrl, // <-- only run query when URL is ready
    })

    // process results
    const processedData = useMemo(() => {
        if (!queryData) return undefined

        console.log('processing list of iri datasets', queryData)

        // convert nested structures to get flat list of datasets
        const flatData = [];
        Object.entries(queryData).forEach(([category, citems]) => {
            Object.entries(citems).forEach(([temporal, titems]) => {
                Object.keys(titems).forEach(variable => {
                    flatData.push(titems[variable]);
                });
            });
        });

        // parse to expected dataset dict
        const parsedData = flatData.map(parseIriDataset)

        // filter to only supported/parseable period types
        return parsedData.filter((d) => d.periodType != undefined)
    }, [queryData])

    // return
    const error = routesError || queryError

    const loading = iriRoute && (routesLoading || queryLoading) && !error

    console.log('useIriDatasets final', processedData, loading, error)

    return {data: processedData, error, loading}
}

export default useIriDatasets;