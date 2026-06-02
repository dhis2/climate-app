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
    extractingLabel,
    featurePayloadMbLimit,
    chunkCount,
    onComplete,
}) => {
    const { data, error } = useEarthEngineData({
        dataset,
        period,
        features,
        featurePayloadMbLimit,
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
        const displayError =
            error?.code === 400 &&
            error?.message?.includes('payload size exceeds')
                ? i18n.t(
                      'An org unit in your selection has boundaries that are too detailed to process. Try removing org units with very complex boundaries and importing again.'
                  )
                : error
        return <ErrorMessage error={displayError} />
    }

    return (
        <>
            {!importDone && <DataLoader label={extractingLabel} height={100} />}
            {data && (
                <ImportData
                    data={data}
                    dataElement={dataElement}
                    features={features}
                    chunkCount={chunkCount}
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
    chunkCount: PropTypes.number,
    extractingLabel: PropTypes.string,
    featurePayloadMbLimit: PropTypes.number,
}

export default ExtractGeeData
