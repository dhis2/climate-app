import { era5Monthly, era5MonthlyNormals } from '../../../data/datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import useDataConnectorTimeSeries from '../../../hooks/useDataConnectorTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import ReferencePeriod from '../ReferencePeriodSelect.jsx'
import getMonthlyConfig from './charts/precipitationMonthly.js'
import {incrementMonths} from '../../../utils/time.js'

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

    console.log('should fetch forecast data based on showForecast state?', showForecast)
    const forecastData = useDataConnectorTimeSeries({
        host: 'http://localhost:7000',
        dataset: showForecast ? 'total_precipitation' : null, // 👈 Conditional fetching,
        periodType: 'month',
        periodStart: incrementMonths(monthlyPeriod.endTime, 1),
        periodEnd: incrementMonths(monthlyPeriod.endTime, 4), // for now, next 4 months only
        orgunits: {type: 'FeatureCollection', features: [orgUnit]},
    })
    console.log('fetched forecastData', forecastData)

    const normals = useEarthEngineClimateNormals(
        era5MonthlyNormals,
        referencePeriod,
        orgUnit
    )

    const { name } = orgUnit.properties

    return (
        <>
            <PeriodTypeSelect />
            {data && normals && settings && (!showForecast || (forecastData?.length > 0)) ? (
                <Chart
                    key={showForecast ? 'with-forecast' : 'no-forecast'} // ✅ Forces React to remount on toggler change
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
