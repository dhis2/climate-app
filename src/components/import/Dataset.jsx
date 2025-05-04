import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { SingleSelectField, SingleSelectOption, CircularLoader, NoticeBox } from '@dhis2/ui';
import PropTypes from 'prop-types';
import useDatasets from '../../hooks/useDatasets.js';

const Dataset = ({ selected, onChange }) => {
    const { datasets, loading, error } = useDatasets();
    console.log(datasets)

    if (loading) return <CircularLoader large />;
    if (false) return <NoticeBox title={i18n.t('Error')} error>{error}</NoticeBox>;

    return (
        <div>
            <h2>{i18n.t('Data')}</h2>
            <SingleSelectField
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
            {selected && <p>{selected.description}</p>}

            {error && (
                <NoticeBox title={i18n.t('Error')} error>{error}</NoticeBox>
            )}
        </div>
    );
};

Dataset.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.object,
};

export default Dataset;
