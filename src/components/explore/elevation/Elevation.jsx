import { demResolution } from '../../../data/datasets.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import getChartConfig from './charts/elevation.js'

const dataset = {
    datasetId: 'USGS/SRTMGL1_003',
    band: 'elevation',
    reducer: ['mean', 'stdDev', 'min', 'max'],
    sharedInputs: true,
}

const Elevation = () => {
    const feature = exploreStore((state) => state.orgUnit)
    const data = useEarthEngineTimeSeries({ dataset, feature })

    if (!data) {
        return <DataLoader />
    }

    const { name } = feature.properties

    return (
        <>
            <Chart config={getChartConfig(name, data)} />
            <Resolution resolution={demResolution} />
        </>
    )
}

export default Elevation
