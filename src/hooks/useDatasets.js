import { useState, useEffect } from 'react'
import geeDatasets from '../data/earth-engine-datasets.js'
import useEarthEngineToken from './useEarthEngineToken.js'
import useEnactsDatasets from './useEnactsDatasets.js'

const useDatasets = () => {
    const [hasToken, setHasToken] = useState()
    const tokenPromise = useEarthEngineToken()

    useEffect(() => {
        tokenPromise
            .then((token) => setHasToken(!!token))
            .catch(() => setHasToken(false))
    }, [tokenPromise])

    const results = [useEnactsDatasets()]

    // Only include GEE datasets if token exists
    if (hasToken) {
        results.push({ data: geeDatasets, error: false, loading: false })
    }

    // Combine hook results
    const loading = results.some((r) => r.loading)
    const errors = results.map((r) => r.error).filter(Boolean)
    const allDatasets = results.flatMap((r) => r.data || [])

    return {
        data: allDatasets,
        loading,
        error: errors.length > 0 ? errors : null,
    }
}

export default useDatasets
