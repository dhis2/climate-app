import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import {
    PROVIDER_ENACTS,
    PROVIDER_GEE,
} from '../../components/DataSourcesProvider.jsx'
import { getPeriods, getPeriodTypes } from '../../utils/time.js'
import ExtractEnactsData from './ExtractEnactsData.jsx'
import ExtractGeeData from './ExtractGeeData.jsx'
import styles from './styles/ExtractData.module.css'

const ExtractData = ({
    dataset,
    period,
    features,
    dataElement,
    onComplete,
}) => {
    const orgUnitsCount = features.length
    let extractingLabel

    if (period) {
        const periodType = getPeriodTypes()
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
                onComplete={onComplete}
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
                onComplete={onComplete}
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
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
}

export default ExtractData
