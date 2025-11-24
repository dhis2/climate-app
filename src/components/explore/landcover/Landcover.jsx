import {
    landcoverResolution,
    landcoverDescription,
} from '../../../data/datasets.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import OpenAsMapButton from '../../shared/OpenAsMapButton.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import getChartConfig from './charts/landcover.js'
import LandcoverSelect from './LandcoverSelect.jsx'
import styles from './styles/Landcover.module.css'

export const band = 'LC_Type1'

const dataset = {
    datasetId: 'MODIS/061/MCD12Q1',
    band,
    reducer: 'frequencyHistogram',
}

const period = {
    startTime: '2002',
    endTime: String(new Date().getFullYear()), // Is the dataset updated every year?
}

const Landcover = () => {
    const feature = exploreStore((state) => state.orgUnit)
    const type = exploreStore((state) => state.landcoverType)
    const data = useEarthEngineTimeSeries({ dataset, period, feature })

    if (!data) {
        return <DataLoader />
    }

    return (
        <>
            <Chart
                config={getChartConfig(feature.properties.name, data, type)}
            />
            <LandcoverSelect data={data} />
            <div className={styles.description}>{landcoverDescription}</div>
            <Resolution resolution={landcoverResolution} />
            <OpenAsMapButton
                dataset={'landcover'}
                period={data?.length > 0 ? data[data.length - 1] : {}}
                feature={feature}
                loading={!(data?.length > 0)}
            />
        </>
    )
}

export default Landcover
