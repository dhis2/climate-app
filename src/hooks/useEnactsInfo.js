import { useQuery } from '@tanstack/react-query'

const useEnactsInfo = (enactsRoute) => {
    // hardcoded results until endpoint is implemented
    // TODO: remove
    const tempData = {
        owner: 'Malawi Department of Climate Change and Meteorological Services',
    }
    return { data: tempData, loading: false, error: false }

    // const infoUrl = enactsRoute ? `${enactsRoute.href}/run/info` : null
    // const fetchInfo = async () => {
    //     console.log('fetching enacts info', infoUrl)
    //     try {
    //         const resp = await fetch(infoUrl, { credentials: 'include' })
    //         if (!resp.ok) {
    //             throw new Error(
    //                 `ENACTS server returned HTTP error at ${infoUrl}: ${resp.status} - ${resp.statusText}`
    //             )
    //         }
    //         return resp.json()
    //     } catch (error) {
    //         // error could be network failure, CORS, or something else
    //         if (
    //             error instanceof TypeError &&
    //             error.message === 'Failed to fetch'
    //         ) {
    //             throw new Error(
    //                 `Failed to fetch ENACTS info from ${infoUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`
    //             )
    //         } else {
    //             console.error(error)
    //             throw new Error(
    //                 `Failed to fetch ENACTS info from ${infoUrl}: ${error}`
    //             )
    //         }
    //     }
    // }

    // const { data, isLoading, error } = useQuery({
    //     queryKey: ['use-enacts-info'],
    //     queryFn: fetchInfo,
    //     enabled: !!infoUrl,
    // })

    // const loading = isLoading && !error

    // return { data, error, loading }
}

export default useEnactsInfo
