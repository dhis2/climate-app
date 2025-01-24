import { era5HeatDaily } from '../../../data/datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import DailyPeriodSelect from '../DailyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getDailyConfig from './charts/thermalComfortDaily.js'
import HeatDescription from './HeatDescription.jsx'

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
