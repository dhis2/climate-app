import { useDataSources } from '../components/DataSourcesProvider.jsx'
import geeDatasets from '../data/earth-engine-datasets.js'
import useEnactsDatasets from './useEnactsDatasets.js'

const useDatasets = () => {
    const {
        data: enactsDatasets,
        error: enactsError,
        loading: enactsLoading,
    } = useEnactsDatasets()

    const { gee } = useDataSources()

    const normalizedGeeDatasets = geeDatasets.map((dataset) => ({
        ...dataset,
        supportedPeriodTypes: dataset.supportedPeriodTypes.map((pt) => ({
            periodType: pt,
        })),
    }))

    const data = gee.enabled
        ? enactsDatasets.concat(normalizedGeeDatasets)
        : enactsDatasets

    return {
        data,
        loading: gee.loading || enactsLoading,
        error: enactsError,
    }
}

export default useDatasets
