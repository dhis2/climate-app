import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'

const useRoutesAPI = () => {
    const engine = useDataEngine()
    const [routes, setRoutes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        engine
            .query({
                routes: {
                    resource: 'routes', // hits /api/routes
                    params: {
                        fields: 'id,code,displayName,url',
                    }
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
    }, [engine])

    return { routes, loading, error }
}

export default useRoutesAPI