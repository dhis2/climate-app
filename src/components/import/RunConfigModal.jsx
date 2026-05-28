import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CalendarInput,
    CircularLoader,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useUserLocale from '../../hooks/useUserLocale.js'
import { getOuText } from '../../utils/getOuText.js'
import {
    computeFillGapRange,
    formatBookmarkDate,
    valueCountForRange,
} from '../../utils/recurringImports.js'
import {
    DAILY,
    MONTHLY,
    WEEKLY,
    YEARLY,
    formatStandardDate,
    getPeriodTypes,
    normalizeIsoDate,
    oneDayInMs,
} from '../../utils/time.js'
import ExtractData from './ExtractData.jsx'
import ImportError from './ImportError.jsx'
import classes from './styles/RunConfigModal.module.css'
import YearSelect from './YearSelect.jsx'

const MAX_VALUES = 50000

const STATE = {
    CONFIRM: 'confirm',
    PROGRESS: 'progress',
    SUCCESS: 'success',
    FAILURE: 'failure',
}

// Fallback range when a config has never successfully imported.
const getDefaultRange = (periodType) => {
    if (periodType === YEARLY) {
        const now = new Date().getFullYear()
        return {
            startTime: String(now - 1),
            endTime: String(now),
            periodType,
        }
    }
    const monthsBack = periodType === 'MONTHLY' ? 12 : 6
    const end = new Date()
    const start = new Date(end.getTime())
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
    const { locale } = useUserLocale()
    const [state, setState] = useState(STATE.CONFIRM)
    const [errorDetails, setErrorDetails] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [importCount, setImportCount] = useState(null)
    const [stageIndex, setStageIndex] = useState(0)
    const [editing, setEditing] = useState(false)
    const [overrideRange, setOverrideRange] = useState(null)

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

    const periodRange = useMemo(
        () =>
            config.dataset?.supportedPeriodTypes?.find(
                (pt) => pt.periodType === config.periodType
            )?.periodRange,
        [config]
    )

    const minDate = normalizeIsoDate(periodRange?.start) || undefined
    const maxDate = normalizeIsoDate(periodRange?.end) || undefined

    const rangeInvalid = isYearly
        ? parseInt(range.startTime, 10) > parseInt(range.endTime, 10)
        : new Date(range.startTime) > new Date(range.endTime)

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
        }),
        [range]
    )

    const stages = useMemo(
        () => [
            i18n.t('Loading org units…'),
            i18n.t('Extracting data from {{provider}}…', {
                provider: config.dataset?.provider?.nameShort ?? '...',
                nsSeparator: ';',
            }),
            i18n.t('Importing values into DHIS2…'),
        ],
        [config]
    )

    useEffect(() => {
        if (state !== STATE.PROGRESS) {
            return undefined
        }
        const interval = setInterval(() => {
            setStageIndex((i) => (i + 1) % stages.length)
        }, 1800)
        return () => clearInterval(interval)
    }, [state, stages.length])

    const handleConfirm = () => {
        setStageIndex(0)
        setErrorMessage(null)
        setErrorDetails(null)
        setState(STATE.PROGRESS)
    }

    const handleSuccess = useCallback(
        (count) => {
            setImportCount(count)
            onRunComplete(config.id, { dataUpdatedThrough: range.endTime })
            setState(STATE.SUCCESS)
        },
        [onRunComplete, config.id, range.endTime]
    )

    const handleError = useCallback((err) => {
        setErrorMessage(
            err?.message ?? err?.toString?.() ?? i18n.t('Unknown error')
        )
        setErrorDetails(err?.details ?? null)
        setState(STATE.FAILURE)
    }, [])

    const handleRetry = () => {
        setErrorMessage(null)
        setErrorDetails(null)
        setStageIndex(0)
        setState(STATE.PROGRESS)
    }

    const closeOnEscape = state !== STATE.PROGRESS ? onClose : undefined

    return (
        <Modal onClose={closeOnEscape} position="middle">
            {state === STATE.CONFIRM && (
                <>
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
                                        {config.dataset?.name ??
                                            config.datasetName}
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
                                        {i18n.t(
                                            'For {{count}} organisation units',
                                            {
                                                count: config.featureCount,
                                                defaultValue:
                                                    'For {{count}} organisation unit',
                                                defaultValue_plural:
                                                    'For {{count}} organisation units',
                                            }
                                        )}
                                    </dt>
                                    <dd>{getOuText(config.orgUnits)}</dd>
                                </div>
                                <div className={classes.summaryRow}>
                                    <dt>
                                        {i18n.t(
                                            'For {{periodType}} date range',
                                            {
                                                periodType:
                                                    getPeriodTypes()
                                                        .find(
                                                            (pt) =>
                                                                pt.id ===
                                                                config.periodType
                                                        )
                                                        ?.name?.toLowerCase() ??
                                                    config.periodType,
                                            }
                                        )}
                                    </dt>
                                    <dd>
                                        {editing ? (
                                            <div
                                                className={classes.rangeEditor}
                                            >
                                                {isYearly ? (
                                                    <div
                                                        className={
                                                            classes.pickers
                                                        }
                                                    >
                                                        <YearSelect
                                                            label={i18n.t(
                                                                'Start year'
                                                            )}
                                                            year={
                                                                range.startTime
                                                            }
                                                            minYear={
                                                                periodRange?.start ??
                                                                '1980'
                                                            }
                                                            maxYear={
                                                                periodRange?.end ??
                                                                String(
                                                                    new Date().getFullYear()
                                                                )
                                                            }
                                                            onChange={(year) =>
                                                                setOverrideRange(
                                                                    (r) => ({
                                                                        ...r,
                                                                        startTime:
                                                                            String(
                                                                                year
                                                                            ),
                                                                    })
                                                                )
                                                            }
                                                        />
                                                        <YearSelect
                                                            label={i18n.t(
                                                                'End year'
                                                            )}
                                                            year={range.endTime}
                                                            minYear={
                                                                periodRange?.start ??
                                                                '1980'
                                                            }
                                                            maxYear={
                                                                periodRange?.end ??
                                                                String(
                                                                    new Date().getFullYear()
                                                                )
                                                            }
                                                            onChange={(year) =>
                                                                setOverrideRange(
                                                                    (r) => ({
                                                                        ...r,
                                                                        endTime:
                                                                            String(
                                                                                year
                                                                            ),
                                                                    })
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={
                                                            classes.pickers
                                                        }
                                                    >
                                                        <CalendarInput
                                                            label={i18n.t(
                                                                'Start date'
                                                            )}
                                                            date={
                                                                range.startTime
                                                            }
                                                            minDate={minDate}
                                                            maxDate={maxDate}
                                                            calendar="gregory"
                                                            locale={
                                                                locale || 'en'
                                                            }
                                                            onDateSelect={({
                                                                calendarDateString,
                                                            }) =>
                                                                setOverrideRange(
                                                                    (r) => ({
                                                                        ...r,
                                                                        startTime:
                                                                            calendarDateString,
                                                                    })
                                                                )
                                                            }
                                                        />
                                                        <CalendarInput
                                                            label={i18n.t(
                                                                'End date'
                                                            )}
                                                            date={range.endTime}
                                                            minDate={minDate}
                                                            maxDate={maxDate}
                                                            calendar="gregory"
                                                            locale={
                                                                locale || 'en'
                                                            }
                                                            onDateSelect={({
                                                                calendarDateString,
                                                            }) =>
                                                                setOverrideRange(
                                                                    (r) => ({
                                                                        ...r,
                                                                        endTime:
                                                                            calendarDateString,
                                                                    })
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}
                                                {rangeInvalid && (
                                                    <span
                                                        className={
                                                            classes.rangeError
                                                        }
                                                    >
                                                        {i18n.t(
                                                            'Start date must be on or before the end date.'
                                                        )}
                                                    </span>
                                                )}
                                                <div
                                                    className={
                                                        classes.rangeActions
                                                    }
                                                >
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
                                                    <Button
                                                        small
                                                        onClick={resetRange}
                                                    >
                                                        {i18n.t(
                                                            'Use default range'
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={classes.rangeDisplay}
                                            >
                                                <span>
                                                    {overrideRange
                                                        ? formatRangeDisplay(
                                                              range
                                                          )
                                                        : config.dataUpdatedThrough
                                                        ? i18n.t(
                                                              'Since last import ({{range}})',
                                                              {
                                                                  range: formatRangeDisplay(
                                                                      range
                                                                  ),
                                                                  nsSeparator:
                                                                      ';',
                                                              }
                                                          )
                                                        : formatRangeDisplay(
                                                              range
                                                          )}
                                                </span>
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
                            <Button onClick={onClose}>
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                primary
                                disabled={exceedsLimit || rangeInvalid}
                                onClick={handleConfirm}
                            >
                                {i18n.t('Start import')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </>
            )}

            {state === STATE.PROGRESS && (
                <>
                    <ModalTitle>
                        {i18n.t('Importing "{{name}}"…', {
                            name: config.name,
                            nsSeparator: ';',
                        })}
                    </ModalTitle>
                    <ModalContent>
                        <div className={classes.progressBody}>
                            <CircularLoader />
                            <div className={classes.stageLabel}>
                                {stages[stageIndex]}
                            </div>
                            <div className={classes.warningText}>
                                {i18n.t("Don't close this tab.")}
                            </div>
                        </div>
                        <div className={classes.hidden}>
                            <ExtractData
                                dataset={config.dataset}
                                period={periodForExtract}
                                orgUnits={config.orgUnits}
                                dataElement={config.dataElement}
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        </div>
                    </ModalContent>
                </>
            )}

            {state === STATE.SUCCESS && (
                <>
                    <ModalTitle>
                        {i18n.t('Imported "{{name}}"', {
                            name: config.name,
                            nsSeparator: ';',
                        })}
                    </ModalTitle>
                    <ModalContent>
                        <div className={classes.body}>
                            <p>
                                {i18n.t(
                                    'Imported {{imported}} values. Data updated to {{date}}.',
                                    {
                                        imported:
                                            importCount?.imported?.toLocaleString() ??
                                            0,
                                        date: formatBookmarkDate(range.endTime),
                                        nsSeparator: ';',
                                    }
                                )}
                            </p>
                            {importCount && (
                                <dl className={classes.summary}>
                                    <div className={classes.summaryRow}>
                                        <dt>{i18n.t('Updated')}</dt>
                                        <dd>{importCount.updated ?? 0}</dd>
                                    </div>
                                    <div className={classes.summaryRow}>
                                        <dt>
                                            {i18n.t('Ignored (already exists)')}
                                        </dt>
                                        <dd>{importCount.ignored ?? 0}</dd>
                                    </div>
                                    <div className={classes.summaryRow}>
                                        <dt>{i18n.t('Missing')}</dt>
                                        <dd>{importCount.missing ?? 0}</dd>
                                    </div>
                                </dl>
                            )}
                        </div>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button primary onClick={onClose}>
                                {i18n.t('Close')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </>
            )}

            {state === STATE.FAILURE && (
                <>
                    <ModalTitle>
                        {i18n.t('Failed to import "{{name}}"', {
                            name: config.name,
                            nsSeparator: ';',
                        })}
                    </ModalTitle>
                    <ModalContent>
                        <div className={classes.body}>
                            {errorDetails ? (
                                <ImportError response={errorDetails} />
                            ) : (
                                <NoticeBox error>
                                    {errorMessage ?? i18n.t('Unknown error')}
                                </NoticeBox>
                            )}
                        </div>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={onClose}>{i18n.t('Close')}</Button>
                            <Button primary onClick={handleRetry}>
                                {i18n.t('Retry')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </>
            )}
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
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onRunComplete: PropTypes.func.isRequired,
}

export default RunConfigModal
