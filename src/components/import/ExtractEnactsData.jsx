import PropTypes from 'prop-types'
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
}) => {
    const { data, error, loading } = useEnactsData(dataset, period, features)

    if (loading) {
        return <DataLoader label={extractingLabel} height={100} />
    }

    if (error) {
        return <ErrorMessage error={error} />
    }

    return (
        <ImportData data={data} dataElement={dataElement} features={features} />
    )
}

ExtractEnactsData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    extractingLabel: PropTypes.string,
}

export default ExtractEnactsData
