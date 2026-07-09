import { useQuery } from '@tanstack/react-query'

const useOcsInfo = (ocsRoute) => {
    const infoUrl = ocsRoute ? `${ocsRoute.href}/run/health` : null
    const fetchInfo = async () => {
        try {
            const resp = await fetch(infoUrl, { credentials: 'include' })
            if (!resp.ok) {
                throw new Error(
                    `OCS server returned HTTP error at ${infoUrl}: ${resp.status} - ${resp.statusText}`
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
                    `Failed to fetch OCS info from ${infoUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`
                )
            } else {
                console.error(error)
                throw new Error(
                    `Failed to fetch OCS info from ${infoUrl}: ${error}`
                )
            }
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['use-ocs-info'],
        queryFn: fetchInfo,
        enabled: !!infoUrl,
    })

    return { data, error, loading: infoUrl && isLoading && !error }
}

export default useOcsInfo
