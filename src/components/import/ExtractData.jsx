import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import {
    PROVIDER_ENACTS,
    PROVIDER_GEE,
} from '../../components/DataSourcesProvider.jsx'
import ExtractEnactsData from './ExtractEnactsData.jsx'
import ExtractGeeData from './ExtractGeeData.jsx'
import styles from './styles/ExtractData.module.css'

const ExtractData = ({
    dataset,
    period,
    features,
    dataElement,
    onSuccess,
    onError,
}) => {
    if (dataset?.provider.id == PROVIDER_GEE) {
        return (
            <ExtractGeeData
                dataset={dataset}
                period={period}
                features={features}
                dataElement={dataElement}
                onSuccess={onSuccess}
                onError={onError}
            />
        )
    } else if (dataset?.provider.id == PROVIDER_ENACTS) {
        return (
            <ExtractEnactsData
                dataset={dataset}
                period={period}
                features={features}
                dataElement={dataElement}
                onSuccess={onSuccess}
                onError={onError}
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
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
}

export default ExtractData
