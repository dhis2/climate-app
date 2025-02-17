import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Chart from '../Chart.jsx'
import getChartConfig from './charts/vegetation.js'
import VegetationIndexSelect, { NDVI, EVI } from './VegetationIndexSelect.jsx'

const dataset = {
    datasetId: 'MODIS/061/MOD13Q1',
    band: [NDVI, EVI],
    // reducer: "frequencyHistogram",
}

const period = {
    startTime: '2015-01-01',
    endTime: '2024-12-31',
}

const Vegetation = () => {
    const feature = exploreStore((state) => state.orgUnit)
    const index = exploreStore((state) => state.vegetationIndex)

    const data = useEarthEngineTimeSeries({ dataset, period, feature })

    console.log('Vegetation', data)

    if (!data) {
        return <DataLoader />
    }

    return (
        <>
            <VegetationIndexSelect />
            <Chart
                config={getChartConfig(feature.properties.name, data, index)}
            />
        </>
    )
}

export default Vegetation
