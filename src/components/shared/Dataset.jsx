import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import datasets from '../../data/datasets.js'

const Dataset = ({
    title = i18n.t('Data'),
    selected,
    onChange,
    showDescription = true,
}) => (
    <div>
        {title && <h2>{title}</h2>}
        <SingleSelectField
            filterable
            label={i18n.t('Select data to import')}
            selected={selected?.id}
            onChange={({ selected }) =>
                onChange(datasets.find((d) => d.id === selected))
            }
        >
            {datasets.map((d) => (
                <SingleSelectOption key={d.id} value={d.id} label={d.name} />
            ))}
        </SingleSelectField>
        {selected && showDescription && <p>{selected.description}</p>}
    </div>
)

Dataset.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.object,
    showDescription: PropTypes.bool,
    title: PropTypes.string,
}

export default Dataset
