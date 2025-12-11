import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import datasets from '../../data/datasets.js'
import SectionH2 from './SectionH2.jsx'

const Dataset = ({ title, selected, onChange, showDescription = true }) => (
    <>
        {title && <SectionH2 number="1" title={title} />}
        <SingleSelectField
            filterable
            label={!title ? i18n.t('Select data to import') : null}
            selected={selected?.id}
            onChange={({ selected }) =>
                onChange(datasets.find((d) => d.id === selected))
            }
        >
            {datasets.map((d) => (
                <SingleSelectOption key={d.id} value={d.id} label={d.name} />
            ))}
        </SingleSelectField>
        {selected && showDescription && (
            <p>
                {selected.description}{' '}
                {i18n.t('Data resolution is {{resolution}}.', {
                    resolution: selected.resolution?.toLowerCase(),
                })}
            </p>
        )}
    </>
)

Dataset.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.object,
    showDescription: PropTypes.bool,
    title: PropTypes.string,
}

export default Dataset
