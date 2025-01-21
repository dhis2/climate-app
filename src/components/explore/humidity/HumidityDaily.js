import Chart from '../Chart'
import PeriodTypeSelect from '../PeriodTypeSelect'
import DailyPeriodSelect from '../DailyPeriodSelect'
import DataLoader from '../../shared/DataLoader'
import Resolution from '../../shared/Resolution'
import HumidityDescription from './HumidityDescription'
import getDailyConfig from './charts/humidityDaily'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import { era5Daily } from '../../../data/datasets'

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
