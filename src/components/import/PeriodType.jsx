import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { periodTypes, DAILY, WEEKLY, SIXTEEN_DAYS, MONTHLY, YEARLY } from '../../utils/time.js'

const PeriodType = ({ periodType, supportedPeriodTypes, onChange }) => {
    //console.log('periodtype func', periodType, supportedPeriodTypes)
    
    // wait for necessary information about supported period types
    if (!supportedPeriodTypes) {
        return null
    }

    // get period type objects from supported period type ids
    const supportedPeriodTypeObjects = periodTypes
            ?.filter(
                (type) =>
                    (
                        (supportedPeriodTypes.includes(type.id))
                    )
            )
    //console.log('periodtype supported', supportedPeriodTypeObjects)

    // make sure selected period type is supported by dataset period type, or set to undefined
    let selectedPeriodType = 
        supportedPeriodTypeObjects.map((type) => type.id).includes(periodType)
        ? periodType
        : undefined

    // if period type is unsupported, set to first allowable type
    if (supportedPeriodTypeObjects.length > 0 && selectedPeriodType === undefined) {
        selectedPeriodType = supportedPeriodTypeObjects[0].id
        onChange(selectedPeriodType)
    }
    //console.log('periodtype selected', selectedPeriodType)
    
    // period type selector
    return (
        <SingleSelectField
            label={i18n.t('Period type')}
            selected={selectedPeriodType}
            onChange={({ selected }) => onChange(selected)}
        >
            {supportedPeriodTypeObjects
                .map((type) => (
                    <SingleSelectOption
                        key={type.id}
                        value={type.id}
                        label={type.name}
                    />
                ))}
        </SingleSelectField>
    )
}

PeriodType.propTypes = {
    periodType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    datasetPeriodType: PropTypes.string,
}

export default PeriodType
