import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Chart from '../Chart.jsx'
import getChartConfig from './charts/landcover.js'
import getAllConfig from './charts/landcoverAll.js'
import getDynamicWorldConfig from './charts/dynamicWorld.js'
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

const dynamicWorld = {
    datasetId: 'GOOGLE/DYNAMICWORLD/V1',
    band: [
        'water',
        'trees',
        'grass',
        'flooded_vegetation',
        'crops',
        'shrub_and_scrub',
        'built',
        'bare',
        'snow_and_ice',
    ], // 'label'
    // reducer: 'frequencyHistogram',
    // reducer: 'count',
    // aggregationPeriod: MONTHLY,
}

const LandCover = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const type = exploreStore((state) => state.landcoverType)

    // const dynamicWorldPeriod = exploreStore((state) => state.monthlyPeriod)
    const dynamicWorldPeriod = {
        startTime: '2024-01',
        endTime: '2024-06',
    }

    // const data = useEarthEngineTimeSeries(dataset, period, orgUnit)
    let data

    const dynamicWorldData = useEarthEngineTimeSeries({
        dataset: dynamicWorld,
        period: dynamicWorldPeriod,
        feature: orgUnit,
    })

    // console.log('dynamicWorldData', dynamicWorldData, dynamicWorldPeriod)

    if (!data && !dynamicWorldData) {
        return <DataLoader />
    }

    /*
    return (
        <>
            <Chart config={getAllConfig(orgUnit.properties.name, data)} />
            <LandcoverSelect />
            <Chart
                config={getChartConfig(orgUnit.properties.name, data, type)}
            />
        </>
    )
    */

    return (
        <>
            <Chart
                config={getDynamicWorldConfig(
                    orgUnit.properties.name,
                    dynamicWorldData,
                    dynamicWorld.band
                )}
            />
        </>
    )
}

export default LandCover
