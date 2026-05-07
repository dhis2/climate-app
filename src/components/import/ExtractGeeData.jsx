import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useEarthEngineData from '../../hooks/useEarthEngineData.js'
import DataLoader from '../shared/DataLoader.jsx'
import ErrorMessage from '../shared/ErrorMessage.jsx'
import ImportData from './ImportData.jsx'

const ExtractGeeData = ({
    dataElement,
    dataset,
    period,
    features,
    onError,
    onSuccess,
}) => {
    const { data, error, progress } = useEarthEngineData({
        dataset,
        period,
        features,
    })

    useEffect(() => {
        if (error && onError) {
            onError(error)
        }
    }, [error, onError])

    if (error) {
        const displayError = /payload size exceeds the limit/i.test(error)
            ? i18n.t(
                  'An org unit in your selection has boundaries that are too detailed to process.'
              )
            : error
        return <ErrorMessage error={displayError} />
    }

    if (!data) {
        let loadingLabel
        if (progress.total > 1) {
            loadingLabel = i18n.t(
                'Extracting data from Google Earth Engine (batch {{current}} of {{total}})',
                {
                    current: progress.current,
                    total: progress.total,
                    nsSeparator: ';',
                }
            )
        } else {
            loadingLabel = i18n.t('Extracting data from Google Earth Engine')
        }
        return <DataLoader label={loadingLabel} height={100} />
    }

    return (
        <ImportData
            data={data}
            dataElement={dataElement}
            features={features}
            period={period}
            onError={onError}
            onSuccess={onSuccess}
        />
    )
}

ExtractGeeData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
}

export default ExtractGeeData
