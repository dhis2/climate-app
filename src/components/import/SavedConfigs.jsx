import i18n from '@dhis2/d2-i18n'
import { Button, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
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

const FREQUENCY_OPTIONS = [
    { value: 'DAILY', label: i18n.t('Daily') },
    { value: 'WEEKLY', label: i18n.t('Weekly') },
    { value: 'MONTHLY', label: i18n.t('Monthly') },
    { value: 'YEARLY', label: i18n.t('Yearly') },
]

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
    const [schedule, setSchedule] = useState(null)
    const [schedulingOpen, setSchedulingOpen] = useState(false)
    const [localFrequency, setLocalFrequency] = useState(null)
    const { name, dataset, periodType, orgUnits, lastImport } = config

    const nextPeriod = computeNextPeriod(lastImport, dataset)
    const isUpToDate = lastImport && !nextPeriod

    const handleOpenSchedule = () => {
        setLocalFrequency(schedule?.frequency || periodType)
        setSchedulingOpen(true)
    }

    const handleSaveSchedule = () => {
        setSchedule({ frequency: localFrequency })
        setSchedulingOpen(false)
    }

    const handleRemoveSchedule = () => {
        setSchedule(null)
        setSchedulingOpen(false)
    }

    return (
        <div className={classes.card}>
            <div className={classes.cardHeader}>
                <span className={classes.configName}>{name}</span>
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
            {schedule && (
                <div className={classes.scheduleInfo}>
                    {i18n.t('Scheduled: {{frequency}}', {
                        frequency: FREQUENCY_OPTIONS.find(
                            (o) => o.value === schedule.frequency
                        )?.label.toLowerCase(),
                        nsSeparator: ';',
                    })}
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
                    {schedulingOpen ? (
                        <div className={classes.scheduleForm}>
                            <SingleSelectField
                                label={i18n.t('Run frequency')}
                                selected={localFrequency}
                                onChange={({ selected }) =>
                                    setLocalFrequency(selected)
                                }
                            >
                                {FREQUENCY_OPTIONS.map(({ value, label }) => (
                                    <SingleSelectOption
                                        key={value}
                                        value={value}
                                        label={label}
                                    />
                                ))}
                            </SingleSelectField>
                            <div className={classes.scheduleFormActions}>
                                <Button
                                    small
                                    secondary
                                    onClick={() => setSchedulingOpen(false)}
                                >
                                    {i18n.t('Cancel')}
                                </Button>
                                {schedule && (
                                    <Button
                                        small
                                        destructive
                                        onClick={handleRemoveSchedule}
                                    >
                                        {i18n.t('Remove schedule')}
                                    </Button>
                                )}
                                <Button
                                    small
                                    primary
                                    onClick={handleSaveSchedule}
                                >
                                    {i18n.t('Save schedule')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {isUpToDate && (
                                <span className={classes.upToDate}>
                                    {i18n.t('Data is up to date')}
                                </span>
                            )}
                            {nextPeriod && (
                                <span className={classes.nextPeriod}>
                                    {i18n.t('Next: {{start}} → {{end}}', {
                                        start: formatPeriodTime(
                                            nextPeriod.startTime,
                                            periodType
                                        ),
                                        end: formatPeriodTime(
                                            nextPeriod.endTime,
                                            periodType
                                        ),
                                        nsSeparator: ';',
                                    })}
                                </span>
                            )}
                            <div className={classes.cardButtons}>
                                <Button
                                    small
                                    destructive
                                    onClick={() => setConfirmDelete(true)}
                                >
                                    {i18n.t('Delete')}
                                </Button>
                                <Button
                                    small
                                    secondary
                                    onClick={handleOpenSchedule}
                                >
                                    {schedule
                                        ? i18n.t('Edit schedule')
                                        : i18n.t('Schedule')}
                                </Button>
                                {!isUpToDate && (
                                    <Button
                                        small
                                        primary
                                        onClick={() =>
                                            onRun(config, nextPeriod)
                                        }
                                    >
                                        {i18n.t('Run')}
                                    </Button>
                                )}
                            </div>
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
