import geeDatasets from '../data/earth-engine-datasets.js'
import useEnactsDatasets from './useEnactsDatasets.js'

const useDatasets = () => {
    const results = [{ data: geeDatasets, error: false, loading: false }]
    results.push(useEnactsDatasets())

    // Combine hook results
    const loading = results.some((r) => r.loading)
    const errors = results.map((r) => r.error).filter(Boolean)
    const allDatasets = results.map((r) => r.data || []).flat()

    return {
        data: allDatasets,
        loading,
        error: errors.length > 0 ? errors : null,
    }
}

export default useDatasets
