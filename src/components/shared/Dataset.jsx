import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import useDatasets from '../../hooks/useDatasets.js'

const Dataset = ({ title, selected, onChange, showDescription = true }) => {
    const { data: datasets, loading, error } = useDatasets()

    return (
        <div>
            {title && <h2>{title}</h2>}
            <SingleSelectField
                filterable={datasets.length > 0}
                label={i18n.t('Select data to import')}
                selected={selected?.id}
                onChange={({ selected }) =>
                    onChange(datasets.find((d) => d.id === selected))
                }
                empty={i18n.t(
                    'No datasets are available. Go to the Settings page to learn how to configure dataset sources.'
                )}
                dataTest="dataset-selector"
                loading={loading}
                error={!!error}
                validationText={
                    !!error && i18n.t('ENACTS datasets could not be loaded')
                }
            >
                {datasets.map((d) => (
                    <SingleSelectOption
                        key={d.id}
                        value={d.id}
                        label={`${d.provider.nameShort}: ${d.name}`}
                    />
                ))}
            </SingleSelectField>

            {selected && showDescription && <p>{selected.description}</p>}

            {selected && showDescription && (
                <p>
                    {i18n.t(
                        'Data is from {{source}}. Accessed via {{provider}}.',
                        {
                            source: selected.source,
                            provider: selected.provider.name,
                        }
                    )}
                </p>
            )}
        </div>
    )
}

Dataset.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.object,
    showDescription: PropTypes.bool,
    title: PropTypes.string,
}

export default Dataset
