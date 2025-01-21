import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import heatStressLegend from '../../data/heat-stress-legend'

const noValue = -999

const automatic = {
    name: ` - ${i18n.t('Calculate from data')} - `,
    from: noValue,
    to: noValue,
}

const HeatCategory = ({ id, label, value, onChange }) => {
    const isLower = id === 'heatMin'

    const items = heatStressLegend.items.filter((c) =>
        isLower ? c.from < 26 : c.from >= 26
    )

    if (isLower) {
        items.reverse()
    }

    return (
        <SingleSelectField
            label={label}
            selected={
                value === null || value === undefined
                    ? String(noValue)
                    : String(value)
            }
            onChange={({ selected }) =>
                onChange(
                    id,
                    selected === String(noValue) ? undefined : Number(selected)
                )
            }
        >
            {[automatic, ...items].map(({ name, from, to }) => (
                <SingleSelectOption
                    key={from}
                    value={String(isLower ? to : from)}
                    label={name}
                />
            ))}
        </SingleSelectField>
    )
}

HeatCategory.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
}

export default HeatCategory
