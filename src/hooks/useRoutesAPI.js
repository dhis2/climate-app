import { useDataEngine, useConfig } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'

const useRoutesAPI = () => {
    const engine = useDataEngine()
    const { serverVersion } = useConfig()
    const [routes, setRoutes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const minorVersion = serverVersion.minor

    useEffect(() => {
        // VERSION_TOGGLE
        if (minorVersion < 40) {
            setLoading(false)
            return
        }
        engine
            .query({
                routes: {
                    resource: 'routes',
                    params: {
                        fields: 'id,code,displayName,url,href',
                    },
                },
            })
            .then(({ routes }) => {
                setRoutes(routes.routes)
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setLoading(false)
            })
    }, [engine, minorVersion])

    return { routes, loading, error }
}

export default useRoutesAPI
