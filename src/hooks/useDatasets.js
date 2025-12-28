import { useDataSources } from '../components/DataSourcesProvider.jsx'
import geeDatasets from '../data/earth-engine-datasets.js'
import useEnactsDatasets from './useEnactsDatasets.js'

// TODO - handle loading state

const useDatasets = () => {
    const results = [useEnactsDatasets()]
    const { geeToken, loading: geeLoading } = useDataSources()

    if (geeToken) {
        results.push({ data: geeDatasets, error: false, loading: false })
    }

    // Combine hook results
    const loading = geeLoading || results.some((r) => r.loading)
    const errors = results.map((r) => r.error).filter(Boolean)
    const allDatasets = results.flatMap((r) => r.data || [])

    return {
        data: allDatasets,
        loading,
        error: errors.length > 0 ? errors : null,
    }
}

export default useDatasets
