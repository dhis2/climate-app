import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import useOrgUnits from '../../hooks/useOrgUnits.js'
import { getOuText } from '../../utils/getOuText.js'
import {
    computeFillGapRange,
    valueCountForRange,
} from '../../utils/recurringImports.js'
import {
    DAILY,
    MONTHLY,
    WEEKLY,
    YEARLY,
    formatBookmarkDate,
    formatStandardDate,
    getPeriodTypes,
    oneDayInMs,
} from '../../utils/time.js'
import DateRangePicker from './DateRangePicker.jsx'
import ImportModal from './ImportModal.jsx'
import classes from './styles/RunConfigModal.module.css'

const MAX_VALUES = 50000

// Fallback range when a config has never successfully imported.
// Uses the same "last completed period" end boundary as computeFillGapRange.
const getDefaultRange = (periodType) => {
    const now = new Date()
    if (periodType === YEARLY) {
        const currentYear = now.getFullYear()
        return {
            startTime: String(currentYear - 2),
            endTime: String(currentYear - 1),
            periodType,
        }
    }
    let end
    if (periodType === DAILY) {
        end = new Date(now.getTime() - oneDayInMs)
    } else if (periodType === MONTHLY) {
        end = new Date(now.getFullYear(), now.getMonth(), 0)
    } else if (periodType === WEEKLY) {
        const dow = now.getDay()
        const daysToLastSunday = dow === 0 ? 7 : dow
        end = new Date(now.getTime() - daysToLastSunday * oneDayInMs)
    } else {
        end = new Date(now.getTime() - oneDayInMs)
    }
    const monthsBack = periodType === MONTHLY ? 12 : 6
    const start = new Date(end)
    start.setMonth(start.getMonth() - monthsBack)
    return {
        startTime: formatStandardDate(start),
        endTime: formatStandardDate(end),
        periodType,
    }
}

const formatRangeDisplay = (range) => {
    if (range.periodType === YEARLY) {
        return `${range.startTime} → ${range.endTime}`
    }
    return `${formatBookmarkDate(range.startTime)} → ${formatBookmarkDate(
        range.endTime
    )}`
}

const RunConfigModal = ({ config, onClose, onRunComplete }) => {
    const {
        features,
        featuresLoading,
        error: featuresError,
    } = useOrgUnits({
        orgUnits: config.orgUnits,
        debounceDelay: 0,
    })
    const [editing, setEditing] = useState(false)
    const [overrideRange, setOverrideRange] = useState(null)
    const [confirmed, setConfirmed] = useState(false)

    const isYearly = config.periodType === YEARLY

    const defaultRange = useMemo(() => {
        const computed = computeFillGapRange(config)
        return computed || getDefaultRange(config.periodType)
    }, [config])

    const range = useMemo(
        () =>
            overrideRange
                ? { ...overrideRange, periodType: config.periodType }
                : defaultRange,
        [overrideRange, defaultRange, config.periodType]
    )

    const rangeInvalid = isYearly
        ? Number.parseInt(range.startTime, 10) >
          Number.parseInt(range.endTime, 10)
        : new Date(range.startTime) > new Date(range.endTime)

    const rangeDisplayText =
        overrideRange || !config.dataUpdatedThrough
            ? formatRangeDisplay(range)
            : i18n.t('Since last import ({{range}})', {
                  range: formatRangeDisplay(range),
                  nsSeparator: ';',
              })

    const startEditing = () => {
        if (!overrideRange) {
            setOverrideRange({
                startTime: range.startTime,
                endTime: range.endTime,
            })
        }
        setEditing(true)
    }

    const resetRange = () => {
        setOverrideRange(null)
        setEditing(false)
    }

    const handleRangeChange = useCallback((updatedPeriod) => {
        setOverrideRange({
            startTime: updatedPeriod.startTime,
            endTime: updatedPeriod.endTime,
        })
    }, [])

    const valueCount = useMemo(
        () =>
            valueCountForRange({
                featureCount: config.featureCount,
                periodType: config.periodType,
                range,
            }),
        [config, range]
    )

    const exceedsLimit = valueCount > MAX_VALUES

    const periodForExtract = useMemo(
        () => ({
            startTime: range.startTime,
            endTime: range.endTime,
            periodType: range.periodType,
            calendar: 'gregory',
            timeZone: config.timeZone,
        }),
        [range, config.timeZone]
    )

    // Strip timezone from the dataset so DateRangePicker never renders the
    // editable TimeZone selector — the saved config's timezone is fixed.
    const datasetForPicker = useMemo(() => {
        if (!config.dataset) {
            return config.dataset
        }
        const d = { ...config.dataset }
        delete d.timeZone
        if (d.bands) {
            d.bands = d.bands.map((b) => {
                const band = { ...b }
                delete band.timeZone
                return band
            })
        }
        return d
    }, [config.dataset])

    const handleImportDone = useCallback(
        (importCount, lastRunError) => {
            onRunComplete(config.id, {
                dataUpdatedThrough: importCount ? range.endTime : undefined,
                lastRunError,
            })
        },
        [onRunComplete, config.id, range.endTime]
    )

    if (confirmed) {
        return (
            <ImportModal
                dataset={config.dataset}
                period={config.dataset?.period ? null : periodForExtract}
                features={features}
                dataElement={config.dataElement}
                onClose={onClose}
                onImportDone={handleImportDone}
            />
        )
    }

    return (
        <Modal onClose={onClose} position="middle">
            <ModalTitle>
                {i18n.t('Import "{{name}}"', {
                    name: config.name,
                    nsSeparator: ';',
                })}
            </ModalTitle>
            <ModalContent>
                <div className={classes.body}>
                    <dl className={classes.summary}>
                        <div className={classes.summaryRow}>
                            <dt>{i18n.t('Data source')}</dt>
                            <dd>
                                {config.dataset?.name ?? config.datasetName}
                            </dd>
                        </div>
                        <div className={classes.summaryRow}>
                            <dt>{i18n.t('DHIS2 data element')}</dt>
                            <dd>
                                {config.dataElement?.displayName ??
                                    config.dataElement?.name}
                            </dd>
                        </div>
                        <div className={classes.summaryRow}>
                            <dt>
                                {i18n.t('For {{count}} organisation units', {
                                    count: config.featureCount,
                                    defaultValue:
                                        'For {{count}} organisation unit',
                                    defaultValue_plural:
                                        'For {{count}} organisation units',
                                })}
                            </dt>
                            <dd>{getOuText(config.orgUnits)}</dd>
                        </div>
                        {config.timeZone && (
                            <div className={classes.summaryRow}>
                                <dt>{i18n.t('Time zone')}</dt>
                                <dd>{config.timeZone}</dd>
                            </div>
                        )}
                        <div className={classes.summaryRow}>
                            <dt>
                                {i18n.t('For {{periodType}} date range', {
                                    periodType:
                                        getPeriodTypes()
                                            .find(
                                                (pt) =>
                                                    pt.id === config.periodType
                                            )
                                            ?.name?.toLowerCase() ??
                                        config.periodType,
                                })}
                            </dt>
                            <dd>
                                {editing ? (
                                    <div className={classes.rangeEditor}>
                                        <DateRangePicker
                                            period={{
                                                startTime: range.startTime,
                                                endTime: range.endTime,
                                                periodType: config.periodType,
                                                calendar: 'gregory',
                                            }}
                                            dataset={datasetForPicker}
                                            onChange={handleRangeChange}
                                        />
                                        {rangeInvalid && (
                                            <span
                                                className={classes.rangeError}
                                            >
                                                {i18n.t(
                                                    'Start date must be on or before the end date.'
                                                )}
                                            </span>
                                        )}
                                        <div className={classes.rangeActions}>
                                            <Button
                                                small
                                                secondary
                                                onClick={() =>
                                                    setEditing(false)
                                                }
                                                disabled={rangeInvalid}
                                            >
                                                {i18n.t('Done')}
                                            </Button>
                                            <Button small onClick={resetRange}>
                                                {i18n.t('Use default range')}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classes.rangeDisplay}>
                                        <span>{rangeDisplayText}</span>
                                        <Button
                                            small
                                            secondary
                                            onClick={startEditing}
                                        >
                                            {i18n.t('Change')}
                                        </Button>
                                    </div>
                                )}
                            </dd>
                        </div>
                    </dl>
                    {featuresError && (
                        <NoticeBox
                            error
                            title={i18n.t('Failed to load org unit geometries')}
                        >
                            {featuresError.message}
                        </NoticeBox>
                    )}
                    {!featuresLoading &&
                        !featuresError &&
                        features.length === 0 && (
                            <NoticeBox
                                warning
                                title={i18n.t('No org unit geometries found')}
                            >
                                {i18n.t(
                                    'None of the selected organisation units have boundaries stored in DHIS2. Update the import configuration to include organisation units with geometry.'
                                )}
                            </NoticeBox>
                        )}
                    {exceedsLimit && (
                        <NoticeBox warning>
                            {i18n.t(
                                'Range exceeds the {{max}}-value limit. Split into multiple runs by importing a shorter date range from the form.',
                                {
                                    max: MAX_VALUES.toLocaleString(),
                                    nsSeparator: ';',
                                }
                            )}
                        </NoticeBox>
                    )}
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onClose}>{i18n.t('Cancel')}</Button>
                    <Button
                        primary
                        disabled={
                            exceedsLimit ||
                            rangeInvalid ||
                            featuresLoading ||
                            !!featuresError ||
                            features.length === 0
                        }
                        onClick={() => setConfirmed(true)}
                    >
                        {i18n.t('Start import')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

RunConfigModal.propTypes = {
    config: PropTypes.shape({
        featureCount: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        orgUnits: PropTypes.array.isRequired,
        periodType: PropTypes.string.isRequired,
        createdByName: PropTypes.string,
        dataElement: PropTypes.object,
        dataUpdatedThrough: PropTypes.string,
        dataset: PropTypes.object,
        datasetName: PropTypes.string,
        lastRunByName: PropTypes.string,
        timeZone: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onRunComplete: PropTypes.func.isRequired,
}

export default RunConfigModal
