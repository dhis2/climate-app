import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

const dataElementQuery = {
    results: {
        resource: 'dataElements',
        params: {
            paging: false,
            filter: 'domainType:eq:AGGREGATE',
            fields: 'id,code,displayName',
        },
    },
}

const DataElement = ({ selected, dataset, onChange }) => {
    const { loading, error, data } = useDataQuery(dataElementQuery)
    const dataElements = data?.results?.dataElements

    useEffect(() => {
        if (!selected && dataset && dataElements) {
            const defaultDataElement = dataElements.find(
                (d) => d.code === dataset.dataElementCode
            )

            if (defaultDataElement) {
                onChange(defaultDataElement)
            }
        }
    }, [selected, dataset, dataElements, onChange])

    return (
        <div>
            <h2>{i18n.t('Data element')}</h2>
            <SingleSelectField
                filterable
                noMatchText={i18n.t('No match found')}
                label={i18n.t('Data element to import data to')}
                selected={selected?.id}
                loading={loading}
                error={!!error}
                validationText={error?.message}
                onChange={({ selected }) =>
                    onChange(dataElements?.find((d) => d.id === selected))
                }
            >
                {dataElements?.map((d) => (
                    <SingleSelectOption
                        key={d.id}
                        value={d.id}
                        label={d.displayName}
                    />
                ))}
            </SingleSelectField>
        </div>
    )
}

DataElement.propTypes = {
    onChange: PropTypes.func.isRequired,
    dataset: PropTypes.object,
    selected: PropTypes.object,
}

export default DataElement
