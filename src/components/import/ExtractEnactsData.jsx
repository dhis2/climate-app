import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useEnactsData from '../../hooks/useEnactsData.js'
import { getPeriods, getPeriodTypes } from '../../utils/time.js'
import DataLoader from '../shared/DataLoader.jsx'
import ErrorMessage from '../shared/ErrorMessage.jsx'
import ImportData from './ImportData.jsx'

const getExtractingLabel = (period, features) => {
    const orgUnitsCount = features.length
    if (period) {
        const periodType = getPeriodTypes()
            .find((type) => type.id === period.periodType)
            ?.name.toLowerCase()
        const periodCount = getPeriods(period).length
        return i18n.t(
            'Importing data for {{periodCount}} {{periodType}} periods and {{orgUnitsCount}} org units ({{valueCount}} values)',
            {
                periodCount,
                periodType,
                orgUnitsCount,
                valueCount: periodCount * orgUnitsCount,
            }
        )
    }
    return i18n.t('Importing data for {{orgUnitsCount}} org units', {
        orgUnitsCount,
    })
}

const ExtractEnactsData = ({
    dataElement,
    dataset,
    period,
    features,
    onError,
    onSuccess,
}) => {
    const extractingLabel = getExtractingLabel(period, features)
    const { data, error } = useEnactsData(dataset, period, features)

    useEffect(() => {
        if (error && onError) {
            onError(error)
        }
    }, [error, onError])

    if (error) {
        return <ErrorMessage error={error} />
    }

    if (!data) {
        return <DataLoader label={extractingLabel} height={100} />
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

ExtractEnactsData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
}

export default ExtractEnactsData
