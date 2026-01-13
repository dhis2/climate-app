import {
    era5Daily,
    getResolutionText,
} from '../../../data/earth-engine-datasets.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import { useDataSources } from '../../DataSourcesProvider.jsx'
import DataLoader from '../../shared/DataLoader.jsx'
import { GEETokenWarning } from '../../shared/GEETokenWarning.jsx'
import OpenAsMapButton from '../../shared/OpenAsMapButton.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import DailyPeriodSelect from '../DailyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getDailyConfig from './charts/humidityDaily.js'
import HumidityDescription from './HumidityDescription.jsx'

const HumidityDaily = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.dailyPeriod)
    const { gee } = useDataSources()

    const data = useEarthEngineTimeSeries({
        dataset: era5Daily,
        period,
        feature: orgUnit,
    })
    const lastPeriod = data?.[data.length - 1]

    const getContent = () => {
        if (!gee.enabled) {
            return <GEETokenWarning />
        }

        if (data) {
            return (
                <Chart config={getDailyConfig(orgUnit.properties.name, data)} />
            )
        }

        return <DataLoader />
    }

    return (
        <>
            <PeriodTypeSelect />
            {getContent()}
            <DailyPeriodSelect disabled={!gee.enabled} />
            <HumidityDescription />
            <Resolution resolution={getResolutionText(era5Daily.resolution)} />
            <OpenAsMapButton
                dataset={'humidityDaily'}
                period={lastPeriod}
                feature={orgUnit}
                loading={!lastPeriod}
            />
        </>
    )
}

export default HumidityDaily
