import i18n from '@dhis2/d2-i18n'
import { useMemo } from 'react'
import {
    era5MonthlyTemperatures,
    era5MonthlyNormals,
} from '../../../data/datasets'
import useAppSettings from '../../../hooks/useAppSettings'
import useEarthEngineClimateNormals from '../../../hooks/useEarthEngineClimateNormals'
import useEarthEngineTimeSeries from '../../../hooks/useEarthEngineTimeSeries'
import exploreStore from '../../../store/exploreStore'
import { getCurrentYear } from '../../../utils/time'
import DataLoader from '../../shared/DataLoader'
import Resolution from '../../shared/Resolution'
import Chart from '../Chart'
import MonthSelect from '../MonthSelect'
import ReferencePeriod from '../ReferencePeriodSelect'
import getChartConfig from './charts/temperatureAnomaly'
import styles from './styles/ClimateChangeTab.module.css'

// Fetch all years from 1970 to the current year
const period = { startTime: '1970-01', endTime: `${getCurrentYear()}-12` }

const ClimateChange = () => {
    const orgUnit = exploreStore((state) => state.orgUnit)
    const month = exploreStore((state) => state.month)
    const referencePeriod = exploreStore((state) => state.referencePeriod)
    const { settings } = useAppSettings()

    const filters = useMemo(
        () => [
            {
                type: 'calendarRange',
                arguments: [month, month, 'month'],
            },
        ],
        [month]
    )

    const data = useEarthEngineTimeSeries(
        era5MonthlyTemperatures,
        period,
        orgUnit,
        filters
    )

    const normals = useEarthEngineClimateNormals(
        era5MonthlyNormals,
        referencePeriod,
        orgUnit
    )

    if (!data || !normals || !settings) {
        return <DataLoader />
    }

    return (
        <>
            <Chart
                config={getChartConfig(
                    orgUnit.properties.name,
                    data,
                    normals,
                    month,
                    referencePeriod,
                    settings
                )}
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
