import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
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
    onComplete,
}) => {
    const extractingLabel = getExtractingLabel(period, features)
    const { data, error } = useEnactsData(dataset, period, features)
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

ExtractEnactsData.propTypes = {
    dataElement: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
}

export default ExtractEnactsData
