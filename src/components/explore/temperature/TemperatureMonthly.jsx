import { era5Monthly, era5MonthlyNormals } from '../../../data/datasets'
import useAppSettings from '../../../hooks/useAppSettings'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import ReferencePeriod from '../ReferencePeriodSelect.jsx'
import getMonthlyConfig from './charts/temperatureMonthly'

const TemperatureMonthly = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.monthlyPeriod)
    const referencePeriod = exploreStore((state) => state.referencePeriod)
    const { settings } = useAppSettings()

    const data = useEarthEngineTimeSeries(era5Monthly, period, orgUnit)

    const normals = useEarthEngineClimateNormals(
        era5MonthlyNormals,
        referencePeriod,
        orgUnit
    )

    return (
        <>
            <PeriodTypeSelect />
            {data && normals && settings ? (
                <Chart
                    config={getMonthlyConfig(
                        orgUnit.properties.name,
                        data,
                        normals,
                        referencePeriod,
                        settings
                    )}
                />
            ) : (
                <DataLoader />
            )}
            <MonthlyPeriodSelect />
            <ReferencePeriod />
            <Resolution resolution={era5Monthly.resolution} />
        </>
    )
}

export default TemperatureMonthly
