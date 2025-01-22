import { era5HeatMonthly } from '../../../data/datasets'
import useAppSettings from '../../../hooks/useAppSettings'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getMonthlyConfig from './charts/thermalComfortMonthly'
import HeatDescription from './HeatDescription.jsx'

const HeatMonthly = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.monthlyPeriod)
    const { settings } = useAppSettings()

    const data = useEarthEngineTimeSeries(era5HeatMonthly, period, orgUnit)

    return (
        <>
            <PeriodTypeSelect />
            {data && settings ? (
                <Chart
                    config={getMonthlyConfig(
                        orgUnit.properties.name,
                        data,
                        settings
                    )}
                />
            ) : (
                <DataLoader />
            )}
            <MonthlyPeriodSelect />
            <HeatDescription />
            <Resolution resolution={era5HeatMonthly.resolution} />
        </>
    )
}

export default HeatMonthly
