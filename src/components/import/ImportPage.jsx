import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, InputField, Radio } from '@dhis2/ui'
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useBlocker } from 'react-router-dom'
import useImportConfigs from '../../hooks/useImportConfigs.js'
import useOrgUnits from '../../hooks/useOrgUnits.js'
import {
    getCompleteFixedPeriodRange,
    normalizeStandardDateBoundary,
} from '../../utils/fixedPeriodRange.js'
import { normalizeDhis2Calendar } from '../../utils/periodEngine.js'
import { autoConfigName } from '../../utils/recurringImports.js'
import {
    getDefaultImportPeriod,
    getStandardPeriod,
    isValidPeriod,
    getPeriods,
    fromStandardDate,
    toDateObject,
    formatStandardDate,
    DAILY,
    MONTHLY,
    WEEKLY,
    YEARLY,
    oneDayInMs,
} from '../../utils/time.js'
import Dataset from '../shared/Dataset.jsx'
import Resolution from '../shared/Resolution.jsx'
import SectionH2 from '../shared/SectionH2.jsx'
import DataElement from './DataElement.jsx'
import ImportModal from './ImportModal.jsx'
import ImportPreview from './ImportPreview.jsx'
import OrgUnits from './OrgUnits.jsx'
import Period from './Period.jsx'
import PeriodType from './PeriodType.jsx'
import classes from './styles/ImportPage.module.css'

const maxValues = 50000
const FIXED_RANGE_PERIOD_TYPES = new Set([WEEKLY, MONTHLY])

const getDatasetPeriodRange = (dataset, periodType) =>
    dataset?.supportedPeriodTypes?.find((pt) => pt.periodType === periodType)
        ?.periodRange ||
    (dataset?.period
        ? { start: dataset.period, end: dataset.period }
        : undefined)

const getPeriodRange = ({ calendar, periodType, range }) => {
    if (!range) {
        const defaultPeriod = getDefaultImportPeriod({ calendar, periodType })
        return {
            startTime: defaultPeriod.startTime,
            endTime: defaultPeriod.endTime,
        }
    }

    const normalizedStart = normalizeStandardDateBoundary(range.start, 'start')
    const normalizedEnd = normalizeStandardDateBoundary(range.end, 'end')
    const validRange = {
        start: normalizedStart || normalizedEnd,
        end: normalizedEnd || normalizedStart,
    }
    // compute end and start depending on requested periodType
    // endTime will generally be converted from standard -> calendar
    // For YEARLY we keep year values (e.g. "2023") so downstream code
    // that expects years for yearly periods continues to work
    let endTime
    let startTime

    try {
        endTime = fromStandardDate(validRange.end, calendar)

        if (periodType === DAILY) {
            // subtract 30 days from end
            const endStd = toDateObject(validRange.end)
            const endDate = new Date(endStd.year, endStd.month - 1, endStd.day)
            const startDate = new Date(endDate.getTime() - 30 * oneDayInMs)
            startTime = fromStandardDate(
                formatStandardDate(startDate),
                calendar
            )
        } else if (periodType === MONTHLY) {
            // subtract 6 months from end
            const endStd = toDateObject(validRange.end)
            const endDate = new Date(endStd.year, endStd.month - 1, endStd.day)
            const startDate = new Date(
                endDate.getFullYear(),
                endDate.getMonth() - 6,
                endDate.getDate()
            )
            startTime = fromStandardDate(
                formatStandardDate(startDate),
                calendar
            )
        } else if (periodType === YEARLY) {
            // for yearly, work with years (keep values like "2023")
            const endYear = toDateObject(validRange.end).year
            startTime =
                validRange.end === validRange.start
                    ? String(endYear)
                    : String(endYear - 1)
            // keep endTime as year string as well
            endTime = String(endYear)
        } else {
            // fallback to provided start
            startTime = fromStandardDate(validRange.start, calendar)
        }
    } catch (e) {
        // if anything goes wrong, fallback to original values
        console.warn('Failed to compute relative startTime, falling back', e)
        startTime = fromStandardDate(validRange.start, calendar)
        endTime = fromStandardDate(validRange.end, calendar)
    }

    return { startTime, endTime }
}

const DEFAULT_ORG_UNITS = []

const ImportPage = () => {
    const { systemInfo = {} } = useConfig()
    const calendar = normalizeDhis2Calendar(systemInfo.calendar)
    const [dataset, setDataset] = useState()
    const [period, setPeriod] = useState(getDefaultImportPeriod({ calendar }))
    const [orgUnits, setOrgUnits] = useState(DEFAULT_ORG_UNITS)
    const [dataElement, setDataElement] = useState()
    const standardPeriod = useMemo(() => getStandardPeriod(period), [period])
    const fixedPeriodRangeValid = useMemo(() => {
        if (!FIXED_RANGE_PERIOD_TYPES.has(period.periodType)) {
            return true
        }

        return getCompleteFixedPeriodRange({
            periodRange: getDatasetPeriodRange(dataset, period.periodType),
            periodType: period.periodType,
            calendar: period.calendar,
            locale: period.locale,
        }).hasCompleteFixedPeriods
    }, [dataset, period.calendar, period.locale, period.periodType])
    const [startExtract, setStartExtract] = useState(false)
    const [importDone, setImportDone] = useState(false)
    const [importFeatures, setImportFeatures] = useState(null)
    const [importAttempted, setImportAttempted] = useState(false)
    const [saveAsRecurring, setSaveAsRecurring] = useState(false)
    const [configName, setConfigName] = useState('')
    const configNameTouched = useRef(false)
    const [savedConfig, setSavedConfig] = useState(null)

    const { createConfig, recordRun } = useImportConfigs()

    useBlocker(startExtract && !importDone)

    const {
        features,
        loading: featuresLoading,
        error: featuresError,
    } = useOrgUnits({
        orgUnits,
    })

    const featureCount = features.length

    const periodCount = useMemo(
        () => getPeriods(standardPeriod).length,
        [standardPeriod]
    )
    const valueCount = featureCount * periodCount

    // canShowPreview: show preview even during loading (avoids unmounting/remounting)
    const canShowPreview = !!(
        dataset &&
        fixedPeriodRangeValid &&
        isValidPeriod(standardPeriod) &&
        !featuresError &&
        featureCount > 0 &&
        dataElement &&
        valueCount <= maxValues
    )

    useEffect(() => {
        setStartExtract(false)
        setImportDone(false)
        setImportAttempted(false)
        setImportFeatures(null)
        setSavedConfig(null)
    }, [dataset, period, orgUnits, dataElement])

    const suggestedName = useMemo(
        () => (dataset ? autoConfigName(dataset, featureCount) : ''),
        [dataset, featureCount]
    )

    // Seed the config name from the suggested name until the user edits it
    useEffect(() => {
        if (!configNameTouched.current) {
            setConfigName(suggestedName)
        }
    }, [suggestedName])

    const handleStartImport = useCallback(async () => {
        let newConfig = null
        if (saveAsRecurring) {
            newConfig = await createConfig({
                name: configName || suggestedName,
                dataset,
                dataElement,
                orgUnits,
                featureCount,
                periodType: period.periodType,
                timeZone: period.timeZone ?? null,
            })
            setSavedConfig(newConfig)
        }
        setImportFeatures(features)
        setStartExtract(true)
    }, [
        saveAsRecurring,
        createConfig,
        configName,
        suggestedName,
        dataset,
        dataElement,
        orgUnits,
        featureCount,
        period,
        features,
    ])

    const handleImportDone = useCallback(
        (importCount, lastRunError) => {
            setImportDone(true)
            if (savedConfig) {
                recordRun(savedConfig.id, {
                    dataUpdatedThrough: importCount
                        ? standardPeriod.endTime
                        : undefined,
                    lastRunError,
                })
            }
        },
        [savedConfig, recordRun, standardPeriod]
    )

    const handleModalClose = useCallback(() => {
        setStartExtract(false)
        setImportDone(false)
        setImportFeatures(null)
        setImportAttempted(true)
        setSavedConfig(null)
    }, [])

    const updatePeriod = useCallback((val) => {
        setPeriod((prev) => ({
            ...prev,
            ...val,
        }))
    }, [])

    // When periodType changes then dataElement selection must be cleared
    const updatePeriodType = useCallback(
        (val) => {
            setDataElement(null)
            const { startTime, endTime } = getPeriodRange({
                range: getDatasetPeriodRange(dataset, val),
                calendar,
                periodType: val,
            })

            updatePeriod({
                periodType: val,
                startTime,
                endTime,
            })
        },
        [calendar, dataset, updatePeriod]
    )

    const updateDataset = useCallback(
        (ds) => {
            setDataset((prev) => {
                const prevHasRangeOrPeriod = !!(
                    prev &&
                    (prev.period ||
                        prev.supportedPeriodTypes.some((pt) => pt.periodRange))
                )

                const periodType = ds.supportedPeriodTypes.some(
                    (pt) => pt.periodType === period.periodType
                )
                    ? period.periodType
                    : ds.supportedPeriodTypes[0].periodType

                const range = getDatasetPeriodRange(ds, periodType)

                if (range || prevHasRangeOrPeriod) {
                    const { startTime, endTime } = getPeriodRange({
                        range,
                        calendar,
                        periodType,
                    })

                    updatePeriod({
                        periodType,
                        startTime,
                        endTime,
                    })
                }
                return ds
            })

            setDataElement(null)
        },
        [period, updatePeriod, calendar]
    )

    return (
        <div className={classes.page}>
            <h1>{i18n.t('Import weather and climate data')}</h1>
            <div className={classes.formContainer}>
                <div className={classes.formSection}>
                    <Dataset
                        title={i18n.t('Data source')}
                        selected={dataset}
                        onChange={updateDataset}
                        showDescription={true}
                    />
                    {dataset && (
                        <PeriodType
                            periodType={period.periodType}
                            supportedPeriodTypes={dataset.supportedPeriodTypes}
                            onChange={updatePeriodType}
                        />
                    )}
                </div>
                <div className={classes.formSection}>
                    <SectionH2
                        number="2"
                        title={i18n.t('Choose destination data element')}
                    />
                    <DataElement
                        selected={dataElement}
                        onChange={setDataElement}
                        datasetCode={dataset?.dataElementCode}
                        periodType={period.periodType}
                    />
                </div>
                <div className={classes.formSection}>
                    <OrgUnits
                        selected={orgUnits}
                        onChange={setOrgUnits}
                        featureCount={featureCount}
                        featuresLoading={featuresLoading}
                        featuresError={featuresError}
                    />
                    {dataset?.resolutionText && (
                        <Resolution
                            resolution={dataset.resolutionText}
                            isImport={true}
                        />
                    )}
                </div>
                <div className={classes.formSection}>
                    <Period
                        period={period}
                        dataset={dataset}
                        onChange={updatePeriod}
                    />
                </div>
                <div className={classes.formSection}>
                    <SectionH2 number="5" title={i18n.t('Save this import?')} />
                    <div className={classes.importTypeCards}>
                        <label
                            className={
                                saveAsRecurring
                                    ? classes.importTypeCard
                                    : classes.importTypeCardSelected
                            }
                        >
                            <Radio
                                name="importType"
                                value="oneTime"
                                label={i18n.t('One-time import')}
                                checked={!saveAsRecurring}
                                onChange={() => setSaveAsRecurring(false)}
                            />
                            <p className={classes.importTypeCardSubtitle}>
                                {i18n.t(
                                    'Run this import once. Your selections are not saved.'
                                )}
                            </p>
                        </label>
                        <label
                            className={
                                saveAsRecurring
                                    ? classes.importTypeCardSelected
                                    : classes.importTypeCard
                            }
                        >
                            <Radio
                                name="importType"
                                value="recurring"
                                label={i18n.t('Save this import')}
                                checked={saveAsRecurring}
                                onChange={() => setSaveAsRecurring(true)}
                            />
                            <p className={classes.importTypeCardSubtitle}>
                                {i18n.t(
                                    'Saved imports can be re-run by any user with data import access. Each run fetches new data since the last import.'
                                )}
                            </p>
                        </label>
                    </div>
                    {saveAsRecurring && (
                        <div className={classes.saveRecurringBox}>
                            <InputField
                                label={i18n.t('Import name')}
                                dataTest="import-name-input"
                                value={configName}
                                onChange={({ value }) => {
                                    configNameTouched.current = true
                                    setConfigName(value)
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className={classes.formSection}>
                    <SectionH2 number="6" title={i18n.t('Review and import')} />
                    {valueCount > maxValues && (
                        <div className={classes.warning}>
                            {i18n.t(
                                'Import limit exceeded: {{valueCount}} values selected (maximum {{maxValues}}). Reduce your selection by choosing fewer organisation units or a shorter time period. Additional imports can be performed separately.',
                                {
                                    nsSeparator: ';',
                                    valueCount,
                                    maxValues,
                                }
                            )}
                        </div>
                    )}
                    {canShowPreview && !startExtract && !importAttempted && (
                        <ImportPreview
                            dataset={dataset.name || ''}
                            periodType={period.periodType || ''}
                            startDate={standardPeriod.startTime || ''}
                            endDate={standardPeriod.endTime || ''}
                            calendar={period.calendar}
                            locale={period.locale}
                            featureCount={featureCount}
                            dataElement={dataElement.displayName || ''}
                            totalValues={valueCount}
                            orgUnits={orgUnits}
                        />
                    )}
                    <div className={classes.submitRow}>
                        <Button
                            primary
                            loading={canShowPreview && featuresLoading}
                            disabled={
                                !canShowPreview ||
                                featuresLoading ||
                                startExtract ||
                                importAttempted
                            }
                            onClick={handleStartImport}
                        >
                            {saveAsRecurring
                                ? i18n.t('Save & import')
                                : i18n.t('Import once')}
                        </Button>
                    </div>
                    {startExtract && (
                        <ImportModal
                            dataset={dataset}
                            period={dataset.period ? null : standardPeriod}
                            features={importFeatures}
                            dataElement={dataElement}
                            savedConfig={savedConfig}
                            onClose={handleModalClose}
                            onImportDone={handleImportDone}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImportPage
