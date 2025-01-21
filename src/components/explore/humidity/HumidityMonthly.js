import { era5Monthly, era5MonthlyNormals } from '../../../data/datasets'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import DataLoader from '../../shared/DataLoader'
import Resolution from '../../shared/Resolution'
import Chart from '../Chart'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect'
import PeriodTypeSelect from '../PeriodTypeSelect'
import ReferencePeriod from '../ReferencePeriodSelect'
import getMonthlyConfig from './charts/humidityMonthly'
import HumidityDescription from './HumidityDescription'

const HumidityMonthly = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.monthlyPeriod)
    const referencePeriod = exploreStore((state) => state.referencePeriod)

    const data = useEarthEngineTimeSeries(era5Monthly, period, orgUnit)

    const normals = useEarthEngineClimateNormals(
        era5MonthlyNormals,
        referencePeriod,
        orgUnit
    )

    return (
        <>
            <PeriodTypeSelect />
            {data && normals ? (
                <Chart
                    config={getMonthlyConfig(
                        orgUnit.properties.name,
                        data,
                        normals,
                        referencePeriod
                    )}
                />
            ) : (
                <DataLoader />
            )}
            <MonthlyPeriodSelect />
            <ReferencePeriod />
            <HumidityDescription />
            <Resolution resolution={era5Monthly.resolution} />
        </>
    )
}

export default HumidityMonthly
