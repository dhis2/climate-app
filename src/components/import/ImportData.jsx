import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import ImportError from './ImportError.jsx'
import ImportResponse from './ImportResponse.jsx'
import NoOrgUnitData from './NoOrgUnitData.jsx'
import styles from './styles/ImportData.module.css'

const dataImportMutation = {
    resource: 'dataValueSets',
    type: 'create',
    data: (dataValues) => dataValues,
}

const countMissing = (data) => {
    // Note: for now we require that all missing values have been converted
    // ...to NaN in a previous step
    let missing = 0
    data.map((obj) => {
        if (isNaN(obj.value)) {
            missing += 1
        }
    })
    return missing
}

const ImportData = ({ data, dataElement, features }) => {
    const [response, setResponse] = useState(false)
    const [mutate, { error }] = useDataMutation(dataImportMutation)

    useEffect(() => {
        mutate({
            dataValues: data
                .filter((d) => !isNaN(d.value)) // NaN values are ignored before sending to DHIS2
                .map((obj) => ({
                    value: obj.value,
                    orgUnit: obj.ou,
                    dataElement: dataElement.id,
                    period: obj.period,
                })),
        }).then((response) => {
            // support for 2.38 +
            if (response.httpStatus === 'OK') {
                // count and add number of missing values to response metadata
                response.response.importCount.missing = countMissing(data)
                setResponse(response.response)
            }
            //support for 2.37
            else if (response.status === 'SUCCESS') {
                // count and add number of missing values to response metadata
                response.importCount.missing = countMissing(data)
                setResponse(response)
            }
        })
    }, [mutate, data, dataElement])

    return (
        <div className={styles.container}>
            {response ? (
                <ImportResponse {...response} />
            ) : error?.details ? (
                <ImportError {...error.details} />
            ) : (
                i18n.t('Importing data to DHIS2')
            )}
            <NoOrgUnitData data={data} features={features} />
        </div>
    )
}

ImportData.propTypes = {
    data: PropTypes.array.isRequired,
    dataElement: PropTypes.object.isRequired,
    features: PropTypes.array.isRequired,
}

export default ImportData
