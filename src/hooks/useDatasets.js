import { useDataSources } from '../components/DataSourcesProvider.jsx'
import getEEDatasets from '../data/earth-engine-datasets.js'
import useEnactsDatasets from './useEnactsDatasets.js'

// TODO - handle loading state

const useDatasets = () => {
    const results = [useEnactsDatasets()]
    const { hasGeeToken, loading: geeLoading } = useDataSources()

    if (hasGeeToken) {
        const normalizedGeeDatasets = getEEDatasets().map((dataset) => ({
            ...dataset,
            supportedPeriodTypes: dataset.supportedPeriodTypes.map((pt) => ({
                periodType: pt,
            })),
        }))
        results.push({
            data: normalizedGeeDatasets,
            error: false,
            loading: false,
        })
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
