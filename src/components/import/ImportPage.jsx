import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, InputField, NoticeBox, Radio } from '@dhis2/ui'
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import useImportConfigs from '../../hooks/useImportConfigs.js'
import useOrgUnits from '../../hooks/useOrgUnits.js'
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
    YEARLY,
    oneDayInMs,
} from '../../utils/time.js'
import Dataset from '../shared/Dataset.jsx'
import Resolution from '../shared/Resolution.jsx'
import SectionH2 from '../shared/SectionH2.jsx'
import DataElement from './DataElement.jsx'
import ExtractData from './ExtractData.jsx'
import ImportPreview from './ImportPreview.jsx'
import OrgUnits from './OrgUnits.jsx'
import Period from './Period.jsx'
import PeriodType from './PeriodType.jsx'
import classes from './styles/ImportPage.module.css'

const maxValues = 50000

const getPeriodRange = ({ calendar, periodType, range }) => {
    const getDefaultRange = () => {
        const defaultPeriod = getDefaultImportPeriod({ calendar, periodType })
        return { start: defaultPeriod.startTime, end: defaultPeriod.endTime }
    }
    const validRange = range || getDefaultRange()
    // compute end and start depending on requested periodType
    // endTime will generally be converted from standard -> calendar
    // For YEARLY we keep year values (e.g. "2023") so downstream code
    // that expects years for yearly periods continues to work
    let endTime = fromStandardDate(validRange.end, calendar)
    let startTime

    try {
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
    const { calendar = 'gregory' } = systemInfo
    const [dataset, setDataset] = useState()
    const [period, setPeriod] = useState(getDefaultImportPeriod({ calendar }))
    const [orgUnits, setOrgUnits] = useState(DEFAULT_ORG_UNITS)
    const [dataElement, setDataElement] = useState()
    const standardPeriod = useMemo(() => getStandardPeriod(period), [period])
    const [startExtract, setStartExtract] = useState(false)
    const [saveAsRecurring, setSaveAsRecurring] = useState(false)
    const [configName, setConfigName] = useState('')
    const configNameTouched = useRef(false)
    const [savedConfig, setSavedConfig] = useState(null)
    const [importSucceeded, setImportSucceeded] = useState(false)

    const { createConfig, recordRun } = useImportConfigs()

    const {
        features,
        loading: featuresLoading,
        error: featuresError,
    } = useOrgUnits({
        orgUnits,
    })

    const featureCount = features.length

    const periodCount = useMemo(() => getPeriods(period).length, [period])
    const valueCount = featureCount * periodCount

    // Period type is intrinsic to the dataset: only offer a choice when the
    // selected dataset supports more than one type (otherwise it's auto-set).
    const showPeriodTypePicker =
        (dataset?.supportedPeriodTypes?.length ?? 0) > 1

    // canShowPreview: show preview even during loading (avoids unmounting/remounting)
    const canShowPreview = !!(
        dataset &&
        isValidPeriod(standardPeriod) &&
        !featuresError &&
        featureCount > 0 &&
        dataElement &&
        valueCount <= maxValues
    )

    // isValid: only true when fully ready (for enabling import button)
    const isValid = canShowPreview && !featuresLoading

    useEffect(() => {
        setStartExtract(false)
        setSavedConfig(null)
        setImportSucceeded(false)
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
        if (saveAsRecurring) {
            const newConfig = await createConfig({
                name: configName || suggestedName,
                dataset,
                dataElement,
                orgUnits,
                featureCount,
                periodType: period.periodType,
            })
            setSavedConfig(newConfig)
        }
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
    ])

    const handleImportSuccess = useCallback(() => {
        setImportSucceeded(true)
        if (savedConfig) {
            recordRun(savedConfig.id, {
                dataUpdatedThrough: standardPeriod.endTime,
            })
        }
    }, [savedConfig, recordRun, standardPeriod])

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
            updatePeriod({ periodType: val })
        },
        [updatePeriod]
    )

    const updateDataset = useCallback(
        (ds) => {
            setDataset((prev) => {
                const prevHasRangeOrPeriod = !!(
                    prev &&
                    (prev.period ||
                        prev.supportedPeriodTypes.some((pt) => pt.periodRange))
                )

                const periodType = ds.supportedPeriodTypes.includes(
                    period.periodType
                )
                    ? period.periodType
                    : ds.supportedPeriodTypes[0].periodType

                const range =
                    ds.supportedPeriodTypes.find(
                        (pt) => pt.periodType === periodType
                    )?.periodRange ||
                    (ds.period
                        ? { start: ds.period, end: ds.period }
                        : undefined)

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
                    {showPeriodTypePicker && (
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
                                !saveAsRecurring
                                    ? classes.importTypeCardSelected
                                    : classes.importTypeCard
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
                                    'Save it so you can re-run it later. Each run fetches new data since the last import.'
                                )}
                            </p>
                        </label>
                    </div>
                    {saveAsRecurring && (
                        <div className={classes.saveRecurringBox}>
                            <InputField
                                label={i18n.t('Import name')}
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
                    {canShowPreview && !startExtract && (
                        <>
                            <ImportPreview
                                dataset={dataset.name || ''}
                                periodType={period.periodType || ''}
                                startDate={period.startTime || ''}
                                endDate={period.endTime || ''}
                                featureCount={featureCount}
                                dataElement={dataElement.displayName || ''}
                                totalValues={valueCount}
                                orgUnits={orgUnits}
                            />
                        </>
                    )}
                    <div className={classes.submitRow}>
                        <Button
                            primary
                            disabled={!isValid || startExtract}
                            onClick={handleStartImport}
                        >
                            {saveAsRecurring
                                ? i18n.t('Save & import')
                                : i18n.t('Import once')}
                        </Button>
                        {startExtract && savedConfig && importSucceeded && (
                            <div className={classes.savedNotice}>
                                <NoticeBox
                                    valid
                                    title={i18n.t('Saved as "{{name}}"', {
                                        name: savedConfig.name,
                                        nsSeparator: ';',
                                    })}
                                >
                                    <Link
                                        to="/imports"
                                        className={classes.savedNoticeLink}
                                    >
                                        {i18n.t('View in Imports →')}
                                    </Link>
                                </NoticeBox>
                            </div>
                        )}
                        {startExtract && isValid && (
                            <ExtractData
                                dataset={dataset}
                                period={dataset.period ? null : standardPeriod}
                                orgUnits={orgUnits}
                                dataElement={dataElement}
                                onSuccess={handleImportSuccess}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportPage
