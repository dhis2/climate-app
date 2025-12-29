import { era5Daily } from '../../../data/earth-engine-datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import { useDataSources } from '../../DataSourcesProvider.jsx'
import DataLoader from '../../shared/DataLoader.jsx'
import { GEETokenWarning } from '../../shared/GEETokenWarning.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import DailyPeriodSelect from '../DailyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getDailyConfig from './charts/temperatureDaily.js'

const TemperatureDaily = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.dailyPeriod)
    const { settings } = useAppSettings()
    const { gee } = useDataSources()

    const data = useEarthEngineTimeSeries({
        dataset: era5Daily,
        period,
        feature: orgUnit,
    })

    const getContent = () => {
        if (!gee.enabled) {
            return <GEETokenWarning />
        }

        if (data && settings) {
            return (
                <Chart
                    config={getDailyConfig(
                        orgUnit.properties.name,
                        data,
                        settings
                    )}
                />
            )
        }

        return <DataLoader />
    }

    return (
        <>
            <PeriodTypeSelect />
            {getContent()}
            <DailyPeriodSelect disabled={!gee.enabled} />
            <Resolution resolution={era5Daily.resolution} />
        </>
    )
}

export default TemperatureDaily
