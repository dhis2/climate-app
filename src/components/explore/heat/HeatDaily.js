import Chart from '../Chart'
import PeriodTypeSelect from '../PeriodTypeSelect'
import DailyPeriodSelect from '../DailyPeriodSelect'
import DataLoader from '../../shared/DataLoader'
import Resolution from '../../shared/Resolution'
import HeatDescription from './HeatDescription'
import getDailyConfig from './charts/thermalComfortDaily'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import useAppSettings from '../../../hooks/useAppSettings'
import { era5HeatDaily } from '../../../data/datasets'

const HeatDaily = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.dailyPeriod)
    const { settings } = useAppSettings()

    const data = useEarthEngineTimeSeries(era5HeatDaily, period, orgUnit)

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
            <HeatDescription />
            <Resolution resolution={era5HeatDaily.resolution} />
        </>
    )
}

export default HeatDaily
