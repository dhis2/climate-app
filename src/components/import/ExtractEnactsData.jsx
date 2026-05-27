import PropTypes from 'prop-types'
import { useEffect, useState, useCallback } from 'react'
import useEnactsData from '../../hooks/useEnactsData.js'
import ErrorMessage from '../shared/ErrorMessage.jsx'
import ImportData from './ImportData.jsx'
import ImportSteps from './ImportSteps.jsx'

const ExtractEnactsData = ({
    dataElement,
    dataset,
    period,
    extractingLabel,
    features,
    onComplete,
}) => {
    const { data, error, loading } = useEnactsData(dataset, period, features)
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
        return <ErrorMessage error={error} />
    }

    return (
        <>
            {!importDone && (
                <ImportSteps
                    extractingLabel={extractingLabel}
                    extractDone={!loading}
                    importDone={importDone}
                />
            )}
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

ExtractEnactsData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
    extractingLabel: PropTypes.string,
}

export default ExtractEnactsData
