import i18n from '@dhis2/d2-i18n'
import { Checkbox, Tooltip } from '@dhis2/ui'
import { useState } from 'react'
import {
    modisResolution,
    ndviDescription,
    eviDescription,
} from '../../../data/datasets.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthlyPeriodSelect from '../MonthlyPeriodSelect.jsx'
import getChartConfig from './charts/vegetation.js'
import styles from './styles/Vegetation.module.css'
import VegetationIndexSelect, { NDVI, EVI } from './VegetationIndexSelect.jsx'

const dataset = {
    datasetId: 'MODIS/061/MOD13Q1',
    band: [NDVI, EVI],
    resolution: 250,
}

const Vegetation = () => {
    const [showWeekly, setShowWeekly] = useState(false)
    const [showMonthly, setShowMonthly] = useState(false)
    const feature = exploreStore((state) => state.orgUnit)
    const band = exploreStore((state) => state.vegetationIndex)
    const period = exploreStore((state) => state.monthlyPeriod)

    const data = useEarthEngineTimeSeries({ dataset, period, feature })

    if (!data) {
        return <DataLoader />
    }

    const { name } = feature.properties

    return (
        <>
            <div className={styles.selectors}>
                <VegetationIndexSelect />
                <div className={styles.showWeeklyMonthly}>
                    {i18n.t('Resample')}
                    <Checkbox
                        label={i18n.t('Weekly')}
                        checked={showWeekly === true}
                        onChange={() => setShowWeekly(!showWeekly)}
                    />
                    <Checkbox
                        label={i18n.t('Monthly')}
                        checked={showMonthly === true}
                        onChange={() => setShowMonthly(!showMonthly)}
                    />
                    <Tooltip
                        content={i18n.t(
                            'Change from 16-days to weekly or monthly periods using linear interpolation. Weekly periods are recommended when importing data to DHIS2.'
                        )}
                        placement="bottom"
                    >
                        <div className={styles.help}>?</div>
                    </Tooltip>
                </div>
            </div>
            <Chart
                config={getChartConfig({
                    name,
                    data,
                    band,
                    period,
                    showWeekly,
                    showMonthly,
                })}
            />
            <MonthlyPeriodSelect />
            <div className={styles.description}>
                {band === NDVI ? ndviDescription : eviDescription}
            </div>
            <Resolution resolution={modisResolution} />
        </>
    )
}

export default Vegetation
