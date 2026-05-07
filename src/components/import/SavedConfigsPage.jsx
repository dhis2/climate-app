import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { useCallback, useState } from 'react'
import useImportConfigs from '../../hooks/useImportConfigs.js'
import ExtractData from './ExtractData.jsx'
import SavedConfigs from './SavedConfigs.jsx'
import classes from './styles/ImportPage.module.css'

const SavedConfigsPage = () => {
    const { configs, deleteConfig, updateConfig } = useImportConfigs()
    const [activeConfigRun, setActiveConfigRun] = useState(null)

    const handleRunConfig = useCallback((config, period) => {
        setActiveConfigRun({ config, period })
    }, [])

    const handleConfigRunSuccess = useCallback(
        (importCount) => {
            if (!activeConfigRun) {
                return
            }
            updateConfig(activeConfigRun.config.id, {
                date: new Date().toISOString(),
                startTime: activeConfigRun.period.startTime,
                endTime: activeConfigRun.period.endTime,
                periodType: activeConfigRun.period.periodType,
                calendar: activeConfigRun.period.calendar,
                importCount,
            })
            setActiveConfigRun(null)
        },
        [activeConfigRun, updateConfig]
    )

    return (
        <div className={classes.page}>
            <h1>{i18n.t('Saved import configurations')}</h1>
            {activeConfigRun ? (
                <div className={classes.formContainer}>
                    <div className={classes.formSection}>
                        <p className={classes.configRunLabel}>
                            {i18n.t('Running saved configuration: {{name}}', {
                                name: activeConfigRun.config.name,
                                nsSeparator: ';',
                            })}
                        </p>
                        <ExtractData
                            dataset={activeConfigRun.config.dataset}
                            period={
                                activeConfigRun.config.dataset.period
                                    ? null
                                    : activeConfigRun.period
                            }
                            orgUnits={activeConfigRun.config.orgUnits}
                            dataElement={activeConfigRun.config.dataElement}
                            onSuccess={handleConfigRunSuccess}
                        />
                        <Button
                            secondary
                            small
                            onClick={() => setActiveConfigRun(null)}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </div>
                </div>
            ) : (
                <SavedConfigs
                    configs={configs}
                    onRunConfig={handleRunConfig}
                    onDeleteConfig={deleteConfig}
                />
            )}
        </div>
    )
}

export default SavedConfigsPage
