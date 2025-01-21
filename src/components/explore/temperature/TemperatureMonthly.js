import { era5Monthly, era5MonthlyNormals } from '../../../data/datasets'
import useAppSettings from '../../../hooks/useAppSettings'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import DataLoader from '../../shared/DataLoader'
import Resolution from '../../shared/Resolution'
import Chart from '../Chart'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect'
import PeriodTypeSelect from '../PeriodTypeSelect'
import ReferencePeriod from '../ReferencePeriodSelect'
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
