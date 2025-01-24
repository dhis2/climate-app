import { era5Daily } from '../../../data/datasets.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import DailyPeriodSelect from '../DailyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getDailyConfig from './charts/humidityDaily.js'
import HumidityDescription from './HumidityDescription.jsx'

const HumidityDaily = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.dailyPeriod)

    const data = useEarthEngineTimeSeries({
        dataset: era5Daily,
        period,
        feature: orgUnit,
    })

    return (
        <>
            <PeriodTypeSelect />
            {data ? (
                <Chart config={getDailyConfig(orgUnit.properties.name, data)} />
            ) : (
                <DataLoader />
            )}
            <DailyPeriodSelect />
            <HumidityDescription />
            <Resolution resolution={era5Daily.resolution} />
        </>
    )
}

export default HumidityDaily
