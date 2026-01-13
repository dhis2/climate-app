import {
    era5HeatDaily,
    getResolutionText,
} from '../../../data/earth-engine-datasets.js'
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
import getDailyConfig from './charts/thermalComfortDaily.js'
import HeatDescription from './HeatDescription.jsx'

const HeatDaily = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.dailyPeriod)
    const { settings } = useAppSettings()
    const { gee } = useDataSources()

    const data = useEarthEngineTimeSeries({
        dataset: era5HeatDaily,
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
            <HeatDescription />
            <Resolution
                resolution={getResolutionText(era5HeatDaily.resolution)}
            />
        </>
    )
}

export default HeatDaily
