import useEarthEngineData from './useEarthEngineData.js'
import useEnactsData from './useEnactsData.js'

const useImport = (dataset, period, features) => {
    if (dataset?.provider.id == 'gee') {
        const { data, error, loading } = useEarthEngineData(
            dataset,
            period,
            features
        )
        return { data, error, loading }
    } else if (dataset?.provider.id == 'enacts') {
        const { data, error, loading } = useEnactsData(
            dataset,
            period,
            features
        )
        return { data, error, loading }
    } else {
        throw Error(`Failed to recognize dataset provider ${dataset?.provider}`)
    }
}
export default useImport
