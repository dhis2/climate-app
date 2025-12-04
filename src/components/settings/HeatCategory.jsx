import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { getLegend } from '../../data/heat-stress-legend.js'

const noValue = -999

const HeatCategory = ({ id, label, value, onChange }) => {
    const isLower = id === 'heatMin'

    const items = getLegend().items.filter((c) =>
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
            {[
                {
                    name: ` - ${i18n.t('Calculate from data')} - `,
                    from: noValue,
                    to: noValue,
                },
                ...items,
            ].map(({ name, from, to }) => (
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
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
}

export default HeatCategory
