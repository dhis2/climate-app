import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'

const YearSelect = ({ label, year, minYear, maxYear, onChange }) => {
    const numMinYear = Number.parseInt(minYear)
    const numMaxYear = Number.parseInt(maxYear)
    return (
        <SingleSelectField
            label={label}
            selected={year}
            onChange={({ selected }) => onChange(Number(selected))}
        >
            {Array.from({ length: numMaxYear - numMinYear + 1 }, (_, i) => (
                <SingleSelectOption
                    key={i}
                    value={String(numMaxYear - i)}
                    label={String(numMaxYear - i)}
                />
            ))}
        </SingleSelectField>
    )
}

YearSelect.propTypes = {
    label: PropTypes.string.isRequired,
    maxYear: PropTypes.string.isRequired,
    minYear: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    year: PropTypes.string,
}

export default YearSelect
