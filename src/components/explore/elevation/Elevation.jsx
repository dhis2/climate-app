import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
// import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
// import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import getChartConfig from './charts/elevation.js'
// import styles from './styles/VegetationIndexSelect.module.css'

const dataset = {
    datasetId: 'MODIS/061/MOD13Q1',
    // band: [NDVI, EVI],
    resolution: 250,
}

const Elevation = () => {
    const feature = exploreStore((state) => state.orgUnit)
    // const period = exploreStore((state) => state.monthlyPeriod)

    // const data = useEarthEngineTimeSeries({ dataset, period, feature })
    const data = null

    if (!data) {
        return <DataLoader />
    }

    const { name } = feature.properties

    return (
        <>
            <Chart
                config={getChartConfig({
                    name,
                    data,
                    band,
                    period,
                })}
            />
        </>
    )
}

export default Elevation
