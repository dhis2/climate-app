import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Chart from '../Chart.jsx'
import getChartConfig from './charts/landcover.js'
import getAllConfig from './charts/landcoverAll.js'
import LandcoverSelect from './LandcoverSelect.jsx'

const dataset = {
    datasetId: 'MODIS/061/MCD12Q1',
    band: ['LC_Type1'],
    reducer: 'frequencyHistogram',
}

const period = {
    startTime: '2001',
    endTime: '2024',
}

const LandCover = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const type = exploreStore((state) => state.landcoverType)

    const data = useEarthEngineTimeSeries(dataset, period, orgUnit)

    if (!data) {
        return <DataLoader />
    }

    return (
        <>
            <Chart config={getAllConfig(orgUnit.properties.name, data)} />
            <LandcoverSelect />
            <Chart
                config={getChartConfig(orgUnit.properties.name, data, type)}
            />
        </>
    )
}

export default LandCover
