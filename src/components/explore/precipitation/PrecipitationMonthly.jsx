import {
    era5Monthly,
    era5MonthlyNormals,
    getResolutionText,
} from '../../../data/earth-engine-datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import { useDataSources } from '../../DataSourcesProvider.jsx'
import DataLoader from '../../shared/DataLoader.jsx'
import { GEETokenWarning } from '../../shared/GEETokenWarning.jsx'
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
    const { gee } = useDataSources()

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

    const getContent = () => {
        if (!gee.enabled) {
            return <GEETokenWarning />
        }

        if (data && normals && settings) {
            return (
                <Chart
                    config={getMonthlyConfig({
                        name,
                        data,
                        normals,
                        referencePeriod,
                        settings,
                    })}
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
            <ReferencePeriod />
            <Resolution
                resolution={getResolutionText(era5Monthly.resolution)}
            />
        </>
    )
}

export default PrecipitationMonthly
