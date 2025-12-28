import { useDataSources } from '../components/DataSourcesProvider.jsx'
import getEEDatasets from '../data/earth-engine-datasets.js'
import useEnactsDatasets from './useEnactsDatasets.js'

const useDatasets = () => {
    const {
        data: enactsDatasets,
        error: enactsError,
        loading: enactsLoading,
    } = useEnactsDatasets()

    const { hasGeeToken, loading: geeLoading } = useDataSources()

    const normalizedGeeDatasets = getEEDatasets().map((dataset) => ({
        ...dataset,
        supportedPeriodTypes: dataset.supportedPeriodTypes.map((pt) => ({
            periodType: pt,
        })),
    }))

    const data = hasGeeToken
        ? enactsDatasets.concat(normalizedGeeDatasets)
        : enactsDatasets

    return {
        data,
        loading: geeLoading || enactsLoading,
        error: enactsError,
    }
}

export default useDatasets
