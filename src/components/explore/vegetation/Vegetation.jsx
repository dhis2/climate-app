import {
    modisResolution,
    ndviDescription,
    eviDescription,
} from '../../../data/datasets.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import getChartConfig from './charts/vegetation.js'
import styles from './styles/VegetationIndexSelect.module.css'
import VegetationIndexSelect, { NDVI, EVI } from './VegetationIndexSelect.jsx'

const dataset = {
    datasetId: 'MODIS/061/MOD13Q1',
    band: [NDVI, EVI],
}

const Vegetation = () => {
    const feature = exploreStore((state) => state.orgUnit)
    const band = exploreStore((state) => state.vegetationIndex)
    const period = exploreStore((state) => state.monthlyPeriod)

    const data = useEarthEngineTimeSeries({ dataset, period, feature })

    if (!data) {
        return <DataLoader />
    }

    const { name } = feature.properties

    return (
        <>
            <VegetationIndexSelect />
            <Chart
                config={getChartConfig({
                    name,
                    data,
                    band,
                    period,
                })}
            />
            <MonthlyPeriodSelect />
            <div className={styles.description}>
                {band === NDVI ? ndviDescription : eviDescription}
            </div>
            <Resolution resolution={modisResolution} />
        </>
    )
}

export default Vegetation
