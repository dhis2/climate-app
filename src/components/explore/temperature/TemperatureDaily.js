import { era5Daily } from '../../../data/datasets'
import useAppSettings from '../../../hooks/useAppSettings'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import DataLoader from '../../shared/DataLoader'
import Resolution from '../../shared/Resolution'
import Chart from '../Chart'
import DailyPeriodSelect from '../DailyPeriodSelect'
import PeriodTypeSelect from '../PeriodTypeSelect'
import getDailyConfig from './charts/temperatureDaily'

const TemperatureDaily = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.dailyPeriod)
    const { settings } = useAppSettings()

    const data = useEarthEngineTimeSeries(era5Daily, period, orgUnit)

    return (
        <>
            <PeriodTypeSelect />
            {data && settings ? (
                <Chart
                    config={getDailyConfig(
                        orgUnit.properties.name,
                        data,
                        settings
                    )}
                />
            ) : (
                <DataLoader />
            )}
            <DailyPeriodSelect />
            <Resolution resolution={era5Daily.resolution} />
        </>
    )
}

export default TemperatureDaily
