import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { MONTHLY, YEARLY, computeNextPeriod } from '../../utils/time.js'
import classes from './styles/SavedConfigs.module.css'

const formatPeriodTime = (timeStr, periodType) => {
    if (!timeStr) {
        return ''
    }
    if (periodType === YEARLY) {
        return timeStr
    }
    const [yearStr, monthStr] = timeStr.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10)
    if (periodType === MONTHLY) {
        return new Date(year, month - 1, 1).toLocaleString('en', {
            month: 'short',
            year: 'numeric',
        })
    }
    return new Date(timeStr).toLocaleString('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

const formatImportDate = (isoTimestamp) => {
    if (!isoTimestamp) {
        return ''
    }
    return new Date(isoTimestamp).toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

const ConfigCard = ({ config, onRun, onDelete }) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const { name, dataset, periodType, orgUnits, lastImport } = config

    const nextPeriod = computeNextPeriod(lastImport, dataset)
    const isUpToDate = lastImport && !nextPeriod

    return (
        <div className={classes.card}>
            <div className={classes.cardHeader}>
                <span className={classes.configName}>{name}</span>
                {!confirmDelete && (
                    <button
                        className={classes.deleteButton}
                        onClick={() => setConfirmDelete(true)}
                        title={i18n.t('Delete configuration')}
                    >
                        ×
                    </button>
                )}
            </div>
            <div className={classes.cardMeta}>
                <span>{dataset.name}</span>
                <span className={classes.metaSep}>·</span>
                <span>{periodType}</span>
                <span className={classes.metaSep}>·</span>
                <span>
                    {i18n.t('{{count}} org units', {
                        count: orgUnits.length,
                        nsSeparator: ';',
                    })}
                </span>
            </div>
            {lastImport && (
                <div className={classes.cardInfo}>
                    <div>
                        {i18n.t('Last import: {{date}}', {
                            date: formatImportDate(lastImport.date),
                            nsSeparator: ';',
                        })}
                    </div>
                    <div>
                        {i18n.t('Data through: {{period}}', {
                            period: formatPeriodTime(
                                lastImport.endTime,
                                periodType
                            ),
                            nsSeparator: ';',
                        })}
                    </div>
                </div>
            )}
            {confirmDelete ? (
                <div className={classes.confirmDelete}>
                    <span>{i18n.t('Delete this configuration?')}</span>
                    <Button small destructive onClick={onDelete}>
                        {i18n.t('Delete')}
                    </Button>
                    <Button
                        small
                        secondary
                        onClick={() => setConfirmDelete(false)}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </div>
            ) : (
                <div className={classes.cardActions}>
                    {isUpToDate ? (
                        <span className={classes.upToDate}>
                            {i18n.t('Data is up to date')}
                        </span>
                    ) : (
                        <>
                            {nextPeriod && (
                                <span className={classes.nextPeriod}>
                                    {i18n.t(
                                        'Next import: {{start}} → {{end}}',
                                        {
                                            start: formatPeriodTime(
                                                nextPeriod.startTime,
                                                periodType
                                            ),
                                            end: formatPeriodTime(
                                                nextPeriod.endTime,
                                                periodType
                                            ),
                                            nsSeparator: ';',
                                        }
                                    )}
                                </span>
                            )}
                            <Button
                                small
                                primary
                                onClick={() => onRun(config, nextPeriod)}
                            >
                                {i18n.t('Run import')}
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

ConfigCard.propTypes = {
    config: PropTypes.shape({
        dataset: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        orgUnits: PropTypes.array.isRequired,
        periodType: PropTypes.string.isRequired,
        lastImport: PropTypes.object,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onRun: PropTypes.func.isRequired,
}

const SavedConfigs = ({ configs, onRunConfig, onDeleteConfig }) => {
    if (!configs.length) {
        return null
    }

    return (
        <div className={classes.container}>
            <h2 className={classes.title}>
                {i18n.t('Saved import configurations')}
            </h2>
            <div className={classes.cardList}>
                {configs.map((config) => (
                    <ConfigCard
                        key={config.id}
                        config={config}
                        onRun={onRunConfig}
                        onDelete={() => onDeleteConfig(config.id)}
                    />
                ))}
            </div>
        </div>
    )
}

SavedConfigs.propTypes = {
    configs: PropTypes.array.isRequired,
    onDeleteConfig: PropTypes.func.isRequired,
    onRunConfig: PropTypes.func.isRequired,
}

export default SavedConfigs
