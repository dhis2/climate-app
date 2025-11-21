import { era5Monthly, era5MonthlyNormals } from '../../../data/datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import OpenAsMapButton from '../../shared/OpenAsMapButton.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import ReferencePeriod from '../ReferencePeriodSelect.jsx'
import getMonthlyConfig from './charts/precipitationMonthly.js'

const PrecipitationMonthly = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const monthlyPeriod = exploreStore((state) => state.monthlyPeriod)
    const referencePeriod = exploreStore((state) => state.referencePeriod)
    const { settings } = useAppSettings()

    const data = useEarthEngineTimeSeries({
        dataset: era5Monthly,
        period: monthlyPeriod,
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
            {data && normals && settings ? (
                <Chart
                    config={getMonthlyConfig({
                        name,
                        data,
                        normals,
                        referencePeriod,
                        settings,
                    })}
                />
            ) : (
                <DataLoader />
            )}
            <MonthlyPeriodSelect />
            <ReferencePeriod />
            <Resolution resolution={era5Monthly.resolution} />
            <OpenAsMapButton
                dataset={'precipitationMonthly'}
                period={monthlyPeriod}
                feature={orgUnit}
            />
        </>
    )
}

export default PrecipitationMonthly
