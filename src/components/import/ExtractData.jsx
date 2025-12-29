import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import {
    PROVIDER_ENACTS,
    PROVIDER_GEE,
} from '../../components/DataSourcesProvider.jsx'
import useOrgUnits from '../../hooks/useOrgUnits.js'
import { getPeriods, periodTypes } from '../../utils/time.js'
import DataLoader from '../shared/DataLoader.jsx'
import ExtractEnactsData from './ExtractEnactsData.jsx'
import ExtractGeeData from './ExtractGeeData.jsx'
import styles from './styles/ExtractData.module.css'

const ExtractData = ({ dataset, period, orgUnits, dataElement }) => {
    const { parent, level } = orgUnits
    const { features } = useOrgUnits(parent.id, level)

    if (!features) {
        return <DataLoader label={i18n.t('Loading org units')} height={100} />
    } else if (!features.length) {
        return (
            <div className={styles.container}>
                {i18n.t('No org units with geometry found for this level')}
            </div>
        )
    }

    const orgUnitsCount = features.length
    let extractingLabel

    if (period) {
        const periodType = periodTypes
            .find((type) => type.id === period.periodType)
            ?.name.toLowerCase()
        const periods = getPeriods(period)
        const periodCount = periods.length
        const valueCount = periodCount * orgUnitsCount

        extractingLabel = i18n.t(
            'Extracting data for {{periodCount}} {{periodType}} periods and {{orgUnitsCount}} org units ({{valueCount}} values)',
            {
                periodCount,
                periodType,
                orgUnitsCount,
                valueCount,
            }
        )
    } else {
        extractingLabel = i18n.t(
            'Extracting data for {{orgUnitsCount}} org units',
            {
                orgUnitsCount,
            }
        )
    }

    if (dataset?.provider.id == PROVIDER_GEE) {
        return (
            <ExtractGeeData
                dataset={dataset}
                period={period}
                features={features}
                dataElement={dataElement}
                extractingLabel={extractingLabel}
            />
        )
    } else if (dataset?.provider.id == PROVIDER_ENACTS) {
        return (
            <ExtractEnactsData
                dataset={dataset}
                period={period}
                features={features}
                dataElement={dataElement}
                extractingLabel={extractingLabel}
            />
        )
    } else {
        return (
            <div className={styles.container}>
                {i18n.t('Dataset provider not recognized')}
            </div>
        )
    }
}

ExtractData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    orgUnits: PropTypes.object.isRequired,
    period: PropTypes.object.isRequired,
}

export default ExtractData
