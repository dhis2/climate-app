import i18n from '@dhis2/d2-i18n'
import {
    SingleSelectField,
    SingleSelectOption,
    CircularLoader,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import useDatasets from '../../hooks/useDatasets.js'

const Dataset = ({ title, selected, onChange, showDescription = true }) => {
    const { data: datasets, loading, error } = useDatasets()

    if (loading) {
        return <CircularLoader large />
    }
    if (error) {
        return (
            <NoticeBox title={i18n.t('Error')} error>
                {error}
            </NoticeBox>
        )
    }

    return (
        <div>
            {title && <h2>{title}</h2>}
            <SingleSelectField
                filterable
                label={i18n.t('Select data to import')}
                selected={selected?.id}
                onChange={({ selected }) =>
                    onChange(datasets.find((d) => d.id === selected))
                }
                dataTest="dataset-selector"
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

            {error && (
                <NoticeBox title={i18n.t('Warning')} warning>
                    {i18n.t(
                        'Error fetching additional datasets from one or more local data providers'
                    )}
                    <ul>
                        {error.map((err) => (
                            <li key={`error-${err.message}`}>{err.message}</li>
                        ))}
                    </ul>
                </NoticeBox>
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
