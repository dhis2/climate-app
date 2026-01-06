import i18n from '@dhis2/d2-i18n'
import { DEM_RESOLUTION, getResolutionText } from '../../../data/datasets.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import getChartConfig from './charts/elevation.js'
import styles from './styles/Elevation.module.css'

const dataset = {
    datasetId: 'USGS/SRTMGL1_003',
    band: 'elevation',
    reducer: ['mean', 'min', 'max'],
    sharedInputs: true,
}

const Elevation = () => {
    const feature = exploreStore((state) => state.orgUnit)
    const data = useEarthEngineTimeSeries({ dataset, feature })

    if (!data) {
        return <DataLoader />
    }

    const { name } = feature.properties

    return (
        <>
            {feature.geometry.type === 'Point' ? (
                <div className={styles.facility}>
                    <h2>
                        {i18n.t('{{name}}: Elevation', {
                            name,
                            nsSeparator: ';',
                        })}
                    </h2>
                    {i18n.t('{{value}} m', { value: data.mean })}
                </div>
            ) : (
                <>
                    <Chart config={getChartConfig(name, data)} />
                    <div className={styles.description}>
                        {i18n.t(
                            'The chart shows the elevation distribution of the selected area, for each meter above sea level it shows the area with this elevation in hectares. The mean, minimum, and maximum elevation values are calculated from the elevation data.'
                        )}
                    </div>
                </>
            )}
            <Resolution resolution={getResolutionText(DEM_RESOLUTION)} />
        </>
    )
}

export default Elevation
