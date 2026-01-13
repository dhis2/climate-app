import {
    era5Monthly,
    era5MonthlyNormals,
    getResolutionText,
} from '../../../data/earth-engine-datasets.js'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals.js'
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
import ReferencePeriod from '../ReferencePeriodSelect.jsx'
import getMonthlyConfig from './charts/humidityMonthly.js'
import HumidityDescription from './HumidityDescription.jsx'

const HumidityMonthly = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const period = exploreStore((state) => state.monthlyPeriod)
    const referencePeriod = exploreStore((state) => state.referencePeriod)
    const { gee } = useDataSources()

    const data = useEarthEngineTimeSeries({
        dataset: era5Monthly,
        period,
        feature: orgUnit,
    })
    const lastPeriod = data?.[data.length - 1]

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

        if (data && normals) {
            return (
                <Chart
                    config={getMonthlyConfig({
                        name,
                        data,
                        normals,
                        referencePeriod,
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
            <HumidityDescription />
            <Resolution
                resolution={getResolutionText(era5Monthly.resolution)}
            />
            <OpenAsMapButton
                dataset={'humidityMonthly'}
                period={lastPeriod}
                feature={orgUnit}
                loading={!lastPeriod}
            />
        </>
    )
}

export default HumidityMonthly
