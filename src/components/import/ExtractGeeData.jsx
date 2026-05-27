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
    extractingLabel,
    onError,
    onSuccess,
}) => {
    const { data, error, loading } = useEarthEngineData(
        dataset,
        period,
        features
    )

    useEffect(() => {
        if (error && onError) {
            onError(error)
        }
    }, [error, onError])

    if (loading) {
        return <DataLoader label={extractingLabel} height={100} />
    }

    if (error) {
        return <ErrorMessage error={error} />
    }

    return (
        <ImportData
            data={data}
            dataElement={dataElement}
            features={features}
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
    extractingLabel: PropTypes.string,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
}

export default ExtractGeeData
