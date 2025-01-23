import { era5HeatDaily } from '../../../data/datasets'
import useAppSettings from '../../../hooks/useAppSettings'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import DataLoader from '../../shared/DataLoader'
import Resolution from '../../shared/Resolution'
import Chart from '../Chart'
import DailyPeriodSelect from '../DailyPeriodSelect'
import PeriodTypeSelect from '../PeriodTypeSelect'
import getDailyConfig from './charts/thermalComfortDaily'
import HeatDescription from './HeatDescription'

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
