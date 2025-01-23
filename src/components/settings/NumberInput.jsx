import { validateDateString } from '@dhis2/multi-calendar-dates'
import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'

const NumberInput = ({ id, label, value, validationText, onChange }) => (
    <InputField
        label={label}
        type="number"
        value={value !== undefined ? String(value) : ''}
        onChange={({ value }) =>
            onChange(id, value !== '' ? Number(value) : undefined)
        }
        warning={!!validationText}
        validationText={validationText}
    />
)
NumberInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    validationText: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
}

export default NumberInput
