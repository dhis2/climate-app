import { era5HeatMonthly } from '../../../data/datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getMonthlyConfig from './charts/thermalComfortMonthly.js'
import HeatDescription from './HeatDescription.jsx'

const HeatMonthly = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.monthlyPeriod)
    const { settings } = useAppSettings()

    const data = useEarthEngineTimeSeries({
        dataset: era5HeatMonthly,
        period,
        feature: orgUnit,
    })

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
