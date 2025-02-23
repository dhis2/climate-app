import { era5Daily } from '../../../data/datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import useDataConnectorTimeSeries from '../../../hooks/useDataConnectorTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import DailyPeriodSelect from '../DailyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getDailyConfig from './charts/precipitationDaily.js'
import {incrementDays} from '../../../utils/time.js'

const PrecipitationDaily = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.dailyPeriod)
    const showForecast = exploreStore((state) => state.showForecast)
    const { settings } = useAppSettings()

    const data = useEarthEngineTimeSeries({
        dataset: era5Daily,
        period,
        feature: orgUnit,
    })

    console.log('should fetch forecast data based on showForecast state?', showForecast)
    const forecastData = useDataConnectorTimeSeries({
        host: 'http://localhost:7000',
        dataset: showForecast ? 'total_precipitation' : null, // 👈 Conditional fetching,
        periodType: 'day',
        periodStart: incrementDays(period.endTime, 1).toISOString().slice(0, 10),
        periodEnd: incrementDays(period.endTime, 14).toISOString().slice(0, 10), // for now, next 14 days only
        orgunits: {type: 'FeatureCollection', features: [orgUnit]},
    })
    console.log('fetched forecastData', forecastData)

    return (
        <>
            <PeriodTypeSelect />
            {data && settings && (!showForecast || (forecastData?.length > 0)) ? (
                <Chart
                    key={showForecast ? 'with-forecast' : 'no-forecast'} // ✅ Forces React to remount on toggler change
                    config={getDailyConfig(
                        orgUnit.properties.name,
                        data,
                        forecastData,
                        settings
                    )}
                />
            ) : (
                <DataLoader />
            )}
            <DailyPeriodSelect allowForecast={true} />
            <Resolution resolution={era5Daily.resolution} />
        </>
    )
}

export default PrecipitationDaily
