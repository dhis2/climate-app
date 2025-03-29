import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import useEarthEngineData from '../../hooks/useEarthEngineData.js'
import useOrgUnits from '../../hooks/useOrgUnits.js'
import { getPeriods, periodTypes } from '../../utils/time.js'
import DataLoader from '../shared/DataLoader.jsx'
import ErrorMessage from '../shared/ErrorMessage.jsx'
import ImportData from './ImportData.jsx'
import styles from './styles/ExtractData.module.css'

const ExtractData = ({ dataset, period, orgUnits, dataElement }) => {
    const { parent, level } = orgUnits
    const { features } = useOrgUnits(parent.id, level)
    const { data, error, loading } = useEarthEngineData(
        dataset,
        period,
        features
    )

    if (!features) {
        return <DataLoader label={i18n.t('Loading org units')} height={100} />
    } else if (!features.length) {
        return (
            <div className={styles.container}>
                {i18n.t('No org units with geometry found for this level')}
            </div>
        )
    }

    if (loading) {
        const orgUnitsCount = features.length
        let label

        if (period) {
            const periodType = periodTypes
                .find((type) => type.id === period.periodType)
                ?.name.toLowerCase()
            const periods = getPeriods(period)
            const periodCount = periods.length
            const valueCount = periodCount * orgUnitsCount

            label = i18n.t(
                'Extracting data for {{periodCount}} {{periodType}} periods and {{orgUnitsCount}} org units ({{valueCount}} values)',
                {
                    periodCount,
                    periodType,
                    orgUnitsCount,
                    valueCount,
                }
            )
        } else {
            label = i18n.t('Extracting data for {{orgUnitsCount}} org units', {
                orgUnitsCount,
            })
        }

        return <DataLoader label={label} height={100} />
    }

    return error ? (
        <ErrorMessage error={error} />
    ) : (
        <ImportData data={data} dataElement={dataElement} features={features} />
    )
}

ExtractData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    orgUnits: PropTypes.object.isRequired,
    period: PropTypes.object.isRequired,
}

export default ExtractData
