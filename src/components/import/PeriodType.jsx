import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { periodTypes, DAILY, SIXTEEN_DAYS, YEARLY } from '../../utils/time.js'

const PeriodType = ({ periodType, datasetPeriodType, onChange }) => {
    return (
        <SingleSelectField
            label={i18n.t('Period type')}
            selected={
                (datasetPeriodType === SIXTEEN_DAYS && periodType === DAILY) ||
                (datasetPeriodType === YEARLY && periodType !== YEARLY)
                    ? undefined
                    : periodType
            }
            onChange={({ selected }) => onChange(selected)}
        >
            {periodTypes
                ?.filter(
                    (type) =>
                        !(
                            (datasetPeriodType === SIXTEEN_DAYS &&
                                type.id === DAILY) ||
                            (datasetPeriodType === YEARLY &&
                                type.id !== YEARLY) ||
                            type.id === YEARLY
                        )
                )
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
