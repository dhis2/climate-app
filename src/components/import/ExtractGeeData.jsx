import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import useEarthEngineData from '../../hooks/useEarthEngineData.js'
import DataLoader from '../shared/DataLoader.jsx'
import ErrorMessage from '../shared/ErrorMessage.jsx'
import ImportData from './ImportData.jsx'

const ExtractGeeData = ({
    dataElement,
    dataset,
    period,
    features,
    onComplete,
}) => {
    const { data, error, progress } = useEarthEngineData({
        dataset,
        period,
        features,
    })
    const [importDone, setImportDone] = useState(false)

    useEffect(() => {
        if (error) {
            onComplete()
        }
    }, [error, onComplete])

    const handleImportComplete = useCallback(() => {
        setImportDone(true)
        onComplete()
    }, [onComplete])

    if (error) {
        const displayError = /payload size exceeds the limit/i.test(error)
            ? i18n.t(
                  'An org unit in your selection has boundaries that are too detailed to process.'
              )
            : error
        return <ErrorMessage error={displayError} />
    }

    let loadingLabel
    if (data) {
        loadingLabel = i18n.t('Importing data to DHIS2')
    } else if (progress.total > 1) {
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

    return (
        <>
            {!importDone && <DataLoader label={loadingLabel} height={100} />}
            {data && (
                <ImportData
                    data={data}
                    dataElement={dataElement}
                    features={features}
                    onComplete={handleImportComplete}
                />
            )}
        </>
    )
}

ExtractGeeData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
}

export default ExtractGeeData
