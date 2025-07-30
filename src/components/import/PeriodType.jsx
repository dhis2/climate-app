import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { periodTypes, DAILY, WEEKLY, SIXTEEN_DAYS, MONTHLY, YEARLY } from '../../utils/time.js'

const PeriodType = ({ periodType, datasetPeriodType, onChange }) => {
    //console.log('periodtype func', periodType, datasetPeriodType, periodTypes)

    // filter supported period types for dataset
    // for now, don't allow aggregating past month level, and year is only acceptable for yearly datasets
    const filteredPeriodTypes = periodTypes
            ?.filter(
                (type) =>
                    (
                        (datasetPeriodType === DAILY && [DAILY, WEEKLY, MONTHLY].includes(type.id)) ||
                        (datasetPeriodType === WEEKLY && [WEEKLY, MONTHLY].includes(type.id)) ||
                        (datasetPeriodType === SIXTEEN_DAYS && [WEEKLY, MONTHLY].includes(type.id)) ||
                        (datasetPeriodType === MONTHLY && [MONTHLY].includes(type.id)) ||
                        (datasetPeriodType === YEARLY && [YEARLY].includes(type.id))
                    )
            )
    //console.log('periodtype filtered', filteredPeriodTypes)

    // make sure selected period type is supported by dataset period type, or set to undefined
    let selectedPeriodType = 
        filteredPeriodTypes.map((type) => type.id).includes(periodType)
        ? periodType
        : undefined

    // if period type is unsupported, set to first allowable type
    if (filteredPeriodTypes.length > 0 && selectedPeriodType === undefined) {
        selectedPeriodType = filteredPeriodTypes[0].id
    }
    //console.log('periodtype selected', selectedPeriodType)
    
    // period type selector
    return (
        <SingleSelectField
            label={i18n.t('Period type')}
            selected={selectedPeriodType}
            onChange={({ selected }) => onChange(selected)}
        >
            {filteredPeriodTypes
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
