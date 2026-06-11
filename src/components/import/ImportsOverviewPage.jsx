import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16 } from '@dhis2/ui'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useDatasets from '../../hooks/useDatasets.js'
import useImportConfigs from '../../hooks/useImportConfigs.js'
import DeleteConfigModal from './DeleteConfigModal.jsx'
import RecurringImportsList from './RecurringImportsList.jsx'
import RunConfigModal from './RunConfigModal.jsx'
import classes from './styles/ImportsOverviewPage.module.css'

const ImportsOverviewPage = () => {
    const navigate = useNavigate()
    const { configs, renameConfig, deleteConfig, recordRun } =
        useImportConfigs()
    const { data: datasets } = useDatasets()
    const [runningConfig, setRunningConfig] = useState(null)
    const [deletingConfig, setDeletingConfig] = useState(null)

    // Re-hydrate the live dataset (with its valueParser/reducer functions) for
    // each config by id, since only the id is persisted.
    const resolvedConfigs = useMemo(() => {
        const byId = new Map((datasets ?? []).map((d) => [d.id, d]))
        return configs.map((config) => ({
            ...config,
            dataset: byId.get(config.datasetId) ?? null,
        }))
    }, [configs, datasets])

    const goToNew = useCallback(() => navigate('/import/new'), [navigate])

    const handleRun = useCallback((config) => setRunningConfig(config), [])
    const handleCloseRun = useCallback(() => setRunningConfig(null), [])
    const handleDelete = useCallback((config) => setDeletingConfig(config), [])
    const handleCancelDelete = useCallback(() => setDeletingConfig(null), [])
    const handleConfirmDelete = useCallback(() => {
        if (deletingConfig) {
            deleteConfig(deletingConfig.id)
            setDeletingConfig(null)
        }
    }, [deletingConfig, deleteConfig])
    const handleRename = useCallback(
        (id, name) => renameConfig(id, name),
        [renameConfig]
    )

    return (
        <div className={classes.page}>
            <header className={classes.pageHeader}>
                <h1 className={classes.pageTitle}>{i18n.t('Imports')}</h1>
                <p className={classes.pageSubtitle}>
                    {i18n.t('Import weather and climate data into DHIS2.')}
                </p>
            </header>

            <section className={classes.newImportCard}>
                <h2 className={classes.newImportTitle}>
                    {i18n.t('New import')}
                </h2>
                <p className={classes.newImportBody}>
                    {i18n.t('Import data once, or save it to re-run later.')}
                </p>
                <div className={classes.newImportAction}>
                    <Button primary icon={<IconAdd16 />} onClick={goToNew}>
                        {i18n.t('Import data')}
                    </Button>
                </div>
            </section>

            <section className={classes.recurringSection}>
                <h2 className={classes.sectionTitle}>
                    {i18n.t('Saved imports')}
                </h2>
                {resolvedConfigs.length === 0 ? (
                    <div className={classes.emptyState}>
                        <p>{i18n.t("You haven't saved any imports yet.")}</p>
                        <p>
                            {i18n.t(
                                'When you create a new import, choose "Save this import" to re-run it with one click as new climate data becomes available.'
                            )}
                        </p>
                    </div>
                ) : (
                    <RecurringImportsList
                        configs={resolvedConfigs}
                        onRun={handleRun}
                        onRename={handleRename}
                        onDelete={handleDelete}
                    />
                )}
            </section>

            {runningConfig && (
                <RunConfigModal
                    config={runningConfig}
                    onClose={handleCloseRun}
                    onRunComplete={recordRun}
                />
            )}
            {deletingConfig && (
                <DeleteConfigModal
                    config={deletingConfig}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    )
}

export default ImportsOverviewPage
