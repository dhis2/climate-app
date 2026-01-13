import { useDataSources } from '../components/DataSourcesProvider.jsx'
import getEEDatasets, {
    getResolutionText,
} from '../data/earth-engine-datasets.js'
import useEnactsDatasets from './useEnactsDatasets.js'

const useDatasets = () => {
    const {
        data: enactsDatasets,
        error: enactsError,
        loading: enactsLoading,
    } = useEnactsDatasets()

    const { gee } = useDataSources()

    const normalizedGeeDatasets = getEEDatasets().map((dataset) => {
        const { periodRange, ...rest } = dataset
        return {
            ...rest,
            resolutionText: getResolutionText(dataset.resolution),
            supportedPeriodTypes: dataset.supportedPeriodTypes.map((pt) => {
                const obj = { periodType: pt }
                if (periodRange) {
                    obj.periodRange = periodRange
                }
                return obj
            }),
        }
    })

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
