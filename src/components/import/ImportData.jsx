import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { useState, useEffect, useMemo } from 'react'
import ImportResponse from './ImportResponse.jsx'
import styles from './styles/ImportData.module.css'

const dataImportMutation = {
    resource: 'dataValueSets',
    type: 'create',
    data: (dataValues) => dataValues,
}

const countMissing = (data) =>
    data.filter((obj) => Number.isNaN(Number(obj.value))).length

const ImportData = ({
    data,
    dataElement,
    features,
    period,
    onSuccess,
    onError,
}) => {
    const [importResult, setImportResult] = useState(null)
    const [mutate, { error }] = useDataMutation(dataImportMutation)

    const sentDataValues = useMemo(
        () =>
            data
                .filter((d) => !Number.isNaN(Number(d.value)))
                .map((obj) => ({
                    value: obj.value,
                    orgUnit: obj.ou,
                    dataElement: dataElement.id,
                    period: obj.period,
                })),
        [data, dataElement]
    )

    const noDataOrgUnits = useMemo(
        () =>
            features
                .filter((f) =>
                    data
                        .filter((d) => d.ou === f.id)
                        .every((d) => Number.isNaN(Number(d.value)))
                )
                .map((f) => f.properties.name),
        [data, features]
    )

    useEffect(() => {
        if (error) {
            if (onError) {
                onError(error)
            }
            const errorResponse = error.details?.response
            if (errorResponse) {
                const missing = countMissing(data)
                const { importCount, conflicts } = errorResponse
                setImportResult({
                    importCount: { ...importCount, missing },
                    conflicts,
                })
            }
        }
    }, [error, onError, data])

    useEffect(() => {
        mutate({ dataValues: sentDataValues }).then((response) => {
            const missing = countMissing(data)
            let importCount
            if (response.httpStatus === 'OK') {
                importCount = { ...response.response.importCount, missing }
                setImportResult({ importCount })
            } else if (response.status === 'SUCCESS') {
                importCount = { ...response.importCount, missing }
                setImportResult({ importCount })
            }
            if (onSuccess && importCount) {
                onSuccess(importCount)
            }
        })
    }, [mutate, sentDataValues, data, onSuccess])

    return (
        <div className={styles.container}>
            {importResult ? (
                <ImportResponse
                    {...importResult}
                    sentDataValues={sentDataValues}
                    features={features}
                    noDataOrgUnits={noDataOrgUnits}
                    period={period}
                />
            ) : (
                i18n.t('Importing data to DHIS2')
            )}
        </div>
    )
}

ImportData.propTypes = {
    data: PropTypes.array.isRequired,
    dataElement: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
    period: PropTypes.object.isRequired,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
}

export default ImportData
