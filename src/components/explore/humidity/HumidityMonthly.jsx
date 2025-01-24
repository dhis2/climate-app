import { era5Monthly, era5MonthlyNormals } from '../../../data/datasets.js'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import ReferencePeriod from '../ReferencePeriodSelect.jsx'
import getMonthlyConfig from './charts/humidityMonthly.js'
import HumidityDescription from './HumidityDescription.jsx'

const HumidityMonthly = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.monthlyPeriod)
    const referencePeriod = exploreStore((state) => state.referencePeriod)

    const data = useEarthEngineTimeSeries({
        dataset: era5Monthly,
        period,
        feature: orgUnit,
    })

    const normals = useEarthEngineClimateNormals(
        era5MonthlyNormals,
        referencePeriod,
        orgUnit
    )

    const { name } = orgUnit.properties

    return (
        <>
            <PeriodTypeSelect />
            {data && normals ? (
                <Chart
                    config={getMonthlyConfig({
                        name,
                        data,
                        normals,
                        referencePeriod,
                    })}
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
