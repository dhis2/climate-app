import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'

const YearSelect = ({ label, year, minYear, maxYear, onChange }) => (
    <SingleSelectField
        label={label}
        selected={String(year)}
        onChange={({ selected }) => onChange(Number(selected))}
    >
        {Array.from({ length: maxYear - minYear + 1 }, (_, i) => (
            <SingleSelectOption
                key={i}
                value={String(maxYear - i)}
                label={String(maxYear - i)}
            />
        ))}
    </SingleSelectField>
)

YearSelect.propTypes = {
    label: PropTypes.string.isRequired,
    minYear: PropTypes.number.isRequired,
    maxYear: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    year: PropTypes.number,
}

export default YearSelect
