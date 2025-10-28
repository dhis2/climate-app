import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

const EMPTY_DATA_ELEMENTS = []

const DataElement = ({
    selected,
    dataElements = EMPTY_DATA_ELEMENTS,
    onChange,
    datasetCode,
}) => {
    const selectableDEs = dataElements.map((d) => d.dataElement)

    useEffect(() => {
        if (selectableDEs.length && datasetCode) {
            const matchingDataElements = selectableDEs.filter((dataElement) =>
                dataElement.code?.startsWith(datasetCode)
            )
            if (matchingDataElements.length === 1) {
                onChange(matchingDataElements[0])
            }
        }
    }, [selectableDEs, onChange, datasetCode])

    return (
        <div>
            <SingleSelectField
                filterable
                label={i18n.t('Dhis2 data element')}
                noMatchText={i18n.t('No match found')}
                selected={selected?.id}
                onChange={({ selected }) =>
                    onChange(selectableDEs.find((d) => d.id === selected))
                }
            >
                {selectableDEs.map((d) => (
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
    dataElements: PropTypes.array,
    datasetCode: PropTypes.string,
    selected: PropTypes.object,
}

export default DataElement
