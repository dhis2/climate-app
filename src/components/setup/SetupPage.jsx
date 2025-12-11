import i18n from '@dhis2/d2-i18n'
import { Radio, Field } from '@dhis2/ui'
import { useState } from 'react'
import datasets from '../../data/datasets.js'
import { DAILY, periodTypes } from '../../utils/time.js'
import Dataset from '../shared/Dataset.jsx'
import DataElement from './DataElement.jsx'
import styles from './styles/SetupPage.module.css'

const SetupPage = () => {
    const [dataset, setDataset] = useState(datasets[0])
    const [periodType, setPeriodType] = useState(DAILY)

    return (
        <div className={styles.container}>
            <h1>{i18n.t('Configuring DHIS2 before importing data')}</h1>
            <p>
                {i18n.t(
                    'Before you can import data, you need to make some configurations in the Maintenance app. For detailed instructions on how to configure DHIS2, choose which data you would like to import below.'
                )}
            </p>
            <Dataset
                title={null}
                selected={dataset}
                onChange={setDataset}
                showDescription={false}
            />
            <h2>{i18n.t('1. Select the period type')}</h2>
            <p>
                {i18n.t(
                    'Choose the period type for the data element you want to create.'
                )}
            </p>
            <Field>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    {periodTypes.map((option) => (
                        <Radio
                            key={option.id}
                            name="periodType"
                            value={option.id}
                            label={option.name}
                            checked={periodType === option.id}
                            onChange={({ value }) => setPeriodType(value)}
                        />
                    ))}
                </div>
            </Field>
            <h2>{i18n.t('2. Create the data element')}</h2>
            <p>
                {i18n.t(
                    'Create DHIS2 data elements only for the data you want to import. We recommend including the data source in the name to distinguish it from other sources (e.g. precepetation data is available from both ERA5-Land and CHIRPS, and there will be additional data providers in the future). If you use the same code specified below, we will preselect the data element in the import interface.'
                )}
            </p>
            <p>
                {i18n.t(
                    "When daily data is imported it can be aggregated to other period types in DHIS2. We don't recommend aggregating across organisation unit levels, especially when going from facility level to higher levels defined by a geographic boundary. To make sure the values remain at its own level, assign all org unit levels as Aggregation levels for each data element created."
                )}
            </p>
            {dataset && <DataElement {...dataset} periodType={periodType} />}
        </div>
    )
}

export default SetupPage
