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
    onComplete,
}) => {
    const { data, error } = useEarthEngineData(dataset, period, features)
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
            {!importDone && <DataLoader label={extractingLabel} height={100} />}
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
    extractingLabel: PropTypes.string,
}

export default ExtractGeeData
