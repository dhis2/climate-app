import i18n from '@dhis2/d2-i18n'
import { useMemo } from 'react'
import {
    era5MonthlyTemperatures,
    era5MonthlyNormals,
} from '../../../data/datasets.js'
import useAppSettings from '../../../hooks/useAppSettings.js'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals.js'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries.js'
import exploreStore from '../../../store/exploreStore.js'
import { getCurrentYear } from '../../../utils/time.js'
import DataLoader from '../../shared/DataLoader.jsx'
import Resolution from '../../shared/Resolution.jsx'
import Chart from '../Chart.jsx'
import MonthSelect from '../MonthSelect.jsx'
import ReferencePeriod from '../ReferencePeriodSelect.jsx'
import getChartConfig from './charts/temperatureAnomaly.js'
import styles from './styles/ClimateChangeTab.module.css'

// Fetch all years from 1970 to the current year
const period = { startTime: '1970-01', endTime: `${getCurrentYear()}-12` }

const ClimateChange = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const month = exploreStore((state) => state.month)
    const referencePeriod = exploreStore((state) => state.referencePeriod)
    const { settings } = useAppSettings()

    const filter = useMemo(
        () => [
            {
                type: 'calendarRange',
                arguments: [month, month, 'month'],
            },
        ],
        [month]
    )

    const data = useEarthEngineTimeSeries({
        dataset: era5MonthlyTemperatures,
        period,
        feature: orgUnit,
        filter,
    })

    const normals = useEarthEngineClimateNormals(
        era5MonthlyNormals,
        referencePeriod,
        orgUnit
    )

    if (!data || !normals || !settings) {
        return <DataLoader />
    }

    const { name } = orgUnit.properties

    return (
        <>
            <Chart
                config={getChartConfig({
                    name,
                    data,
                    normals,
                    month,
                    referencePeriod,
                    settings,
                })}
            />
            <div className={styles.monthSelect}>
                <MonthSelect />
            </div>
            <ReferencePeriod />
            <div className={styles.description}>
                {i18n.t(
                    'Temperature anomaly is the difference of a temperature from a reference value, calculated as the average temperature over a period of 30 years. Blue columns shows temperatures below the average, while red columns are above.'
                )}
            </div>
            <Resolution resolution={era5MonthlyTemperatures.resolution} />
        </>
    )
}

export default ClimateChange
