import { era5Daily } from '../../../data/datasets'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import DailyPeriodSelect from '../DailyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getDailyConfig from './charts/humidityDaily'
import HumidityDescription from './HumidityDescription.jsx'

const HumidityDaily = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.dailyPeriod)

    const data = useEarthEngineTimeSeries(era5Daily, period, orgUnit)

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
