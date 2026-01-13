import {
    era5HeatMonthly,
    getResolutionText,
} from '../../../data/earth-engine-datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import { useDataSources } from '../../DataSourcesProvider.jsx'
import DataLoader from '../../shared/DataLoader.jsx'
import { GEETokenWarning } from '../../shared/GEETokenWarning.jsx'
import OpenAsMapButton from '../../shared/OpenAsMapButton.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from '../PeriodTypeSelect.jsx'
import getMonthlyConfig from './charts/thermalComfortMonthly.js'
import HeatDescription from './HeatDescription.jsx'

const HeatMonthly = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.monthlyPeriod)
    const { settings } = useAppSettings()
    const { gee } = useDataSources()

    const data = useEarthEngineTimeSeries({
        dataset: era5HeatMonthly,
        period,
        feature: orgUnit,
    })
    const lastPeriod = data?.[data.length - 1]

    const getContent = () => {
        if (!gee.enabled) {
            return <GEETokenWarning />
        }

        if (data && settings) {
            return (
                <Chart
                    config={getMonthlyConfig(
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
            <MonthlyPeriodSelect disabled={!gee.enabled} />
            <HeatDescription />
            <Resolution
                resolution={getResolutionText(era5HeatMonthly.resolution)}
            />
            <OpenAsMapButton
                dataset={'heatMonthly'}
                period={lastPeriod}
                feature={orgUnit}
                loading={!lastPeriod}
            />
        </>
    )
}

export default HeatMonthly
