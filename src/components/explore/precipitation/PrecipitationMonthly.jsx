import { era5Monthly, era5MonthlyNormals } from '../../../data/datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
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
    const showForecast = exploreStore((state) => state.showForecast)
    const { settings } = useAppSettings()

    const data = useEarthEngineTimeSeries({
        dataset: era5Monthly,
        period: monthlyPeriod,
        feature: orgUnit,
    })

    let forecastData = null
    {showForecast && (
        forecastData = [
            {'id': '2025-02', 'forecast_precipitation_sum': 0.18},
            {'id': '2025-03', 'forecast_precipitation_sum': 0.33},
            {'id': '2025-04', 'forecast_precipitation_sum': 0.5},
            {'id': '2025-05', 'forecast_precipitation_sum': 0.88}
        ]
    )}

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
                        forecastData,
                        normals,
                        referencePeriod,
                        settings,
                    })}
                />
            ) : (
                <DataLoader />
            )}
            <MonthlyPeriodSelect allowForecast={true} />
            <ReferencePeriod />
            <Resolution resolution={era5Monthly.resolution} />
        </>
    )
}

export default PrecipitationMonthly
