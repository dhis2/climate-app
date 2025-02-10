import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { periodTypes } from '../../utils/time.js'

const PeriodType = ({ periodType, onChange }) => (
    <SingleSelectField
        label={i18n.t('Period type')}
        selected={periodType}
        onChange={({ selected }) => onChange(selected)}
    >
        {periodTypes?.map((type) => (
            <SingleSelectOption
                key={type.id}
                value={type.id}
                label={type.name}
            />
        ))}
    </SingleSelectField>
)

PeriodType.propTypes = {
    periodType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default PeriodType
