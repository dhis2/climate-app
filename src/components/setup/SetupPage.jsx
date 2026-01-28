import i18n from '@dhis2/d2-i18n'
import { Radio, Field } from '@dhis2/ui'
import { useState } from 'react'
import { DAILY, WEEKLY, MONTHLY, getPeriodTypes } from '../../utils/time.js'
import HelpfulInfo from '../import/HelpfulInfo.jsx'
import Dataset from '../shared/Dataset.jsx'
import DataElement from './DataElement.jsx'
import styles from './styles/SetupPage.module.css'

const defaultPeriodTypes = [DAILY, WEEKLY, MONTHLY]

const SetupPage = () => {
    const [dataset, setDataset] = useState(null)
    const [periodType, setPeriodType] = useState(DAILY)

    // Get supported period types from dataset, or use defaults
    const supportedPeriodTypes =
        dataset?.supportedPeriodTypes.map((pt) => pt.periodType) ||
        defaultPeriodTypes
    const supportedPeriodTypeObjects = getPeriodTypes().filter((type) =>
        supportedPeriodTypes.includes(type.id)
    )

    // Make sure selected period type is supported, otherwise select first supported type
    const isCurrentPeriodTypeSupported =
        supportedPeriodTypes.includes(periodType)
    const selectedPeriodType = isCurrentPeriodTypeSupported
        ? periodType
        : supportedPeriodTypes[0]

    // Update period type if it's not supported by the selected dataset
    if (!isCurrentPeriodTypeSupported && supportedPeriodTypes.length > 0) {
        setPeriodType(supportedPeriodTypes[0])
    }

    return (
        <div className={styles.container}>
            <h1>{i18n.t('Configure DHIS2 in order to import data')}</h1>
            <p>
                {i18n.t(
                    'For detailed instructions on how to configure DHIS2 metadata in the Maintenance app, choose which dataset you would like to import:'
                )}
            </p>
            <Dataset
                selected={dataset}
                onChange={setDataset}
                showDescription={false}
                showLabel={false}
            />
            <HelpfulInfo
                text={i18n.t(
                    'Create only one DHIS2 data element per dataset, using the lowest period type needed for analysis, to avoid duplicating data.'
                )}
            />
            {dataset && (
                <>
                    <h2>{i18n.t('1. Select the period type')}</h2>
                    {supportedPeriodTypeObjects.length > 1 && (
                        <p>
                            {i18n.t(
                                'Select the lowest period type needed for analysis. Data can then be aggregated to other period types in DHIS2 during analysis in Maps, Data Visualizer, and other apps.'
                            )}
                        </p>
                    )}
                    <Field>
                        <div
                            style={{
                                display: 'flex',
                                gap: '16px',
                                marginTop: '8px',
                            }}
                        >
                            {supportedPeriodTypeObjects.map((option) => (
                                <Radio
                                    key={option.id}
                                    name="periodType"
                                    value={option.id}
                                    label={option.name}
                                    checked={selectedPeriodType === option.id}
                                    onChange={({ value }) =>
                                        setPeriodType(value)
                                    }
                                />
                            ))}
                        </div>
                    </Field>
                    <h2>{i18n.t('2. Create the DHIS2 data element')}</h2>
                    {dataset && (
                        <DataElement
                            {...dataset}
                            periodType={selectedPeriodType}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default SetupPage
