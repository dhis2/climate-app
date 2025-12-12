import getEEDatasets from '../data/earth-engine-datasets.js'
import useEnactsDatasets from './useEnactsDatasets.js'

const useDatasets = () => {
    const results = [{ data: getEEDatasets(), error: false, loading: false }]
    results.push(useEnactsDatasets())

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
