import i18n from '@dhis2/d2-i18n'
import {
    Button,
    FlyoutMenu,
    IconDelete16,
    IconEdit16,
    IconMore16,
    Layer,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import {
    computeFillGapRange,
    formatBookmarkDate,
    formatRelativeTime,
} from '../../utils/recurringImports.js'
import { getPeriodTypes } from '../../utils/time.js'
import classes from './styles/RecurringImportsList.module.css'

const periodTypeLabel = (id) =>
    getPeriodTypes().find((t) => t.id === id)?.name ?? id

const RecurringImportRow = ({ config, onRun, onRename, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(config.name)
    const [menuOpen, setMenuOpen] = useState(false)
    const inputRef = useRef(null)
    const menuButtonRef = useRef(null)

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [isEditing])

    const startEdit = () => {
        setEditValue(config.name)
        setIsEditing(true)
        setMenuOpen(false)
    }

    const cancelEdit = () => setIsEditing(false)

    const commitEdit = () => {
        const trimmed = editValue.trim()
        if (trimmed && trimmed !== config.name) {
            onRename(config.id, trimmed)
        }
        setIsEditing(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            commitEdit()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            cancelEdit()
        }
    }

    const range = computeFillGapRange(config)

    const ouCountLabel = i18n.t('{{count}} org units', {
        count: config.orgUnits.length,
        defaultValue: '{{count}} org unit',
        defaultValue_plural: '{{count}} org units',
    })

    const runStatusLabel = config.lastRunAt
        ? i18n.t('Data imported through {{date}} · Last run {{relative}}', {
              date: formatBookmarkDate(config.dataUpdatedThrough),
              relative: formatRelativeTime(config.lastRunAt),
              nsSeparator: ';',
          })
        : i18n.t('Never imported')

    const runStatusTooltip =
        config.lastRunAt && config.lastRunByName
            ? i18n.t('{{date}} by {{user}}', {
                  date: new Date(config.lastRunAt).toLocaleString(),
                  user: config.lastRunByName,
                  nsSeparator: ';',
              })
            : undefined

    const metadataLabel = [
        periodTypeLabel(config.periodType),
        ouCountLabel,
    ].join(' · ')

    return (
        <article className={classes.card}>
            <header className={classes.header}>
                <div className={classes.nameGroup}>
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            className={classes.nameInput}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={cancelEdit}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <>
                            <h3 className={classes.name}>{config.name}</h3>
                            <button
                                type="button"
                                aria-label={i18n.t('Rename')}
                                className={classes.renameButton}
                                onClick={startEdit}
                            >
                                <IconEdit16 />
                            </button>
                        </>
                    )}
                </div>
                <div className={classes.headerActions}>
                    <Button
                        small
                        disabled={
                            !config.dataset ||
                            (!range && !!config.dataUpdatedThrough)
                        }
                        title={
                            !config.dataset
                                ? i18n.t('Data source is not available')
                                : undefined
                        }
                        onClick={() => onRun(config)}
                    >
                        {i18n.t('Import…')}
                    </Button>
                    <button
                        ref={menuButtonRef}
                        type="button"
                        aria-label={i18n.t('More actions')}
                        className={classes.overflowButton}
                        onClick={() => setMenuOpen((o) => !o)}
                    >
                        <IconMore16 />
                    </button>
                    {menuOpen && (
                        <Layer onBackdropClick={() => setMenuOpen(false)}>
                            <Popover
                                reference={menuButtonRef.current}
                                placement="bottom-end"
                                onClickOutside={() => setMenuOpen(false)}
                            >
                                <FlyoutMenu>
                                    <MenuItem
                                        icon={<IconEdit16 />}
                                        label={i18n.t('Rename')}
                                        onClick={startEdit}
                                    />
                                    <MenuItem
                                        destructive
                                        icon={<IconDelete16 />}
                                        label={i18n.t('Delete')}
                                        onClick={() => {
                                            setMenuOpen(false)
                                            onDelete(config)
                                        }}
                                    />
                                </FlyoutMenu>
                            </Popover>
                        </Layer>
                    )}
                </div>
            </header>

            <p className={classes.runStatus} title={runStatusTooltip}>
                {runStatusLabel}
            </p>
            <p className={classes.metadata}>{metadataLabel}</p>
        </article>
    )
}

RecurringImportRow.propTypes = {
    config: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        orgUnits: PropTypes.array.isRequired,
        periodType: PropTypes.string.isRequired,
        dataUpdatedThrough: PropTypes.string,
        dataset: PropTypes.object,
        datasetId: PropTypes.string,
        datasetName: PropTypes.string,
        lastRunAt: PropTypes.string,
        lastRunByName: PropTypes.string,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onRename: PropTypes.func.isRequired,
    onRun: PropTypes.func.isRequired,
}

const RecurringImportsList = ({ configs, onRun, onRename, onDelete }) => (
    <div className={classes.list}>
        {configs.map((config) => (
            <RecurringImportRow
                key={config.id}
                config={config}
                onRun={onRun}
                onRename={onRename}
                onDelete={onDelete}
            />
        ))}
    </div>
)

RecurringImportsList.propTypes = {
    configs: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    onRename: PropTypes.func.isRequired,
    onRun: PropTypes.func.isRequired,
}

export default RecurringImportsList
