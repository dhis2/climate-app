import PropTypes from 'prop-types'
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
}) => {
    const { data, error, loading } = useEarthEngineData(
        dataset,
        period,
        features
    )

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

ExtractGeeData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    extractingLabel: PropTypes.string,
}

export default ExtractGeeData
