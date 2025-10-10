import geeDatasets from '../data/earth-engine-datasets.js'

const useEarthEngineDatasets = () => {
    // fetch and return static hardcoded datasets
    const loading = false
    const error = false
    console.log('useEarthEngineDatasets final', geeDatasets, loading, error)

    return { data: geeDatasets, error, loading }
}

export default useEarthEngineDatasets
