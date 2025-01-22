import { era5Monthly, era5MonthlyNormals } from '../../../data/datasets'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import ReferencePeriod from '../ReferencePeriodSelect.jsx'
import getMonthlyConfig from './charts/humidityMonthly'
import HumidityDescription from './HumidityDescription.jsx'

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
