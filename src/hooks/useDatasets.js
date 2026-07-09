import { useDataSources } from '../components/DataSourcesProvider.jsx'
import getEEDatasets, {
    getResolutionText,
} from '../data/earth-engine-datasets.js'
import useEnactsDatasets from './useEnactsDatasets.js'
import useOcsDatasets from './useOcsDatasets.js'

const useDatasets = () => {
    const {
        data: ocsDatasets,
        error: ocsError,
        loading: ocsLoading,
    } = useOcsDatasets()

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

    const data = ocsDatasets.concat(
        gee.enabled
            ? enactsDatasets.concat(normalizedGeeDatasets)
            : enactsDatasets
    )

    return {
        data,
        loading: gee.loading || enactsLoading || ocsLoading,
        error: enactsError || ocsError,
    }
}

export default useDatasets
