import { era5HeatDaily } from '../../../data/datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import OpenAsMapButton from '../../shared/OpenAsMapButton.jsx'
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

    const data = useEarthEngineTimeSeries({
        dataset: era5HeatDaily,
        period,
        feature: orgUnit,
    })

    return (
        <>
            <PeriodTypeSelect />
            {data && settings ? (
                <Chart
                    config={getDailyConfig(
                        orgUnit.properties.name,
                        data,
                        settings
                    )}
                />
            ) : (
                <DataLoader />
            )}
            <DailyPeriodSelect />
            <HeatDescription />
            <Resolution resolution={era5HeatDaily.resolution} />
            <OpenAsMapButton
                dataset={'heatDaily'}
                period={data?.length > 0 ? data[data.length - 1] : {}}
                feature={orgUnit}
                loading={!(data?.length > 0)}
            />
        </>
    )
}

export default HeatDaily
