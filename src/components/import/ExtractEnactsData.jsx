import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useEnactsData from '../../hooks/useEnactsData.js'
import DataLoader from '../shared/DataLoader.jsx'
import ErrorMessage from '../shared/ErrorMessage.jsx'
import ImportData from './ImportData.jsx'

const ExtractEnactsData = ({
    dataElement,
    dataset,
    period,
    extractingLabel,
    features,
    onComplete,
}) => {
    const { data, error, loading } = useEnactsData(dataset, period, features)

    useEffect(() => {
        if (error) {
            onComplete?.()
        }
    }, [error]) // eslint-disable-line react-hooks/exhaustive-deps

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
            onComplete={onComplete}
        />
    )
}

ExtractEnactsData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    extractingLabel: PropTypes.string,
    onComplete: PropTypes.func,
}

export default ExtractEnactsData
