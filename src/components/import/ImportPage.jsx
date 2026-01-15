import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { useState, useMemo, useEffect, useCallback } from 'react'
import useOrgUnitCount from '../../hooks/useOrgUnitCount.js'
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
import classes from './styles/ImportPage.module.css'

const maxValues = 50000

const ImportPage = () => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const [dataset, setDataset] = useState()
    const [period, setPeriod] = useState(getDefaultImportPeriod(calendar))
    const [orgUnits, setOrgUnits] = useState()
    const [dataElement, setDataElement] = useState()
    const standardPeriod = getStandardPeriod(period) // ISO 8601 used by GEE
    const [startExtract, setStartExtract] = useState(false)

    const orgUnitCount = useOrgUnitCount(orgUnits?.parent?.id, orgUnits?.level)
    const periodCount = useMemo(() => getPeriods(period).length, [period])
    const valueCount = orgUnitCount * periodCount

    const isValidOrgUnits =
        orgUnits?.parent &&
        orgUnits.level &&
        orgUnits.parent.path.split('/').length - 1 <= Number(orgUnits.level)

    const isValid = !!(
        dataset &&
        isValidPeriod(standardPeriod) &&
        isValidOrgUnits &&
        dataElement &&
        valueCount <= maxValues
    )

    useEffect(() => {
        setStartExtract(false)
    }, [dataset, period, orgUnits, dataElement])

    const updatePeriod = (val) => {
        setDataElement(null)
        setPeriod(val)
    }

    const updateDataset = useCallback(
        (ds) => {
            const updatePeriodSelector = ({
                periodType,
                supportedPeriodTypes,
                period: dsPeriod,
            }) => {
                const periodRange =
                    supportedPeriodTypes.find(
                        (pt) => pt.periodType === periodType
                    )?.periodRange || undefined

                if (periodRange) {
                    // compute end and start depending on requested periodType
                    // endTime will generally be converted from standard -> calendar
                    // For YEARLY we keep year values (e.g. "2023") so downstream code
                    // that expects years for yearly periods continues to work
                    let endTime = fromStandardDate(periodRange.end, calendar)
                    let startTime

                    try {
                        if (periodType === DAILY) {
                            // subtract 30 days from end
                            const endStd = toDateObject(periodRange.end)
                            const endDate = new Date(
                                endStd.year,
                                endStd.month - 1,
                                endStd.day
                            )
                            const startDate = new Date(
                                endDate.getTime() - 30 * oneDayInMs
                            )
                            startTime = fromStandardDate(
                                formatStandardDate(startDate),
                                calendar
                            )
                        } else if (periodType === MONTHLY) {
                            // subtract 6 months from end
                            const endStd = toDateObject(periodRange.end)
                            const endDate = new Date(
                                endStd.year,
                                endStd.month - 1,
                                endStd.day
                            )
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
                            const endYear = toDateObject(periodRange.end).year
                            startTime = String(endYear - 1)
                            // keep endTime as year string as well
                            endTime = String(endYear)
                        } else {
                            // fallback to provided start
                            startTime = fromStandardDate(
                                periodRange.start,
                                calendar
                            )
                        }
                    } catch (e) {
                        // if anything goes wrong, fallback to original values
                        console.warn(
                            'Failed to compute relative startTime, falling back',
                            e
                        )
                        startTime = fromStandardDate(
                            periodRange.start,
                            calendar
                        )
                        endTime = fromStandardDate(periodRange.end, calendar)
                    }

                    setPeriod({
                        periodType,
                        calendar,
                        locale: period.locale,
                        startTime,
                        endTime,
                    })
                } else {
                    setPeriod(
                        getDefaultImportPeriod(calendar, periodType, dsPeriod)
                    )
                }
            }

            setDataset(ds)
            setDataElement(null)
            updatePeriodSelector(ds)
        },
        [calendar, period]
    )

    return (
        <div className={classes.page}>
            <h1>{i18n.t('Import weather and climate data')}</h1>
            <div className={classes.formContainer}>
                <div className={classes.formSection}>
                    <Dataset
                        title={i18n.t('Choose data source')}
                        selected={dataset}
                        onChange={updateDataset}
                    />
                </div>
                <div className={classes.formSection}>
                    <Period
                        period={period}
                        dataset={dataset}
                        onChange={updatePeriod}
                    />
                </div>
                <div className={classes.formSection}>
                    <SectionH2
                        number="3"
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
                    <OrgUnits selected={orgUnits} onChange={setOrgUnits} />
                    {dataset?.resolutionText && (
                        <Resolution
                            resolution={dataset.resolutionText}
                            isImport={true}
                        />
                    )}
                </div>
                <div className={classes.formSection}>
                    <SectionH2 number="5" title={i18n.t('Review and import')} />
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
                    {isValid && !startExtract && (
                        <ImportPreview
                            dataset={dataset.name || ''}
                            periodType={period.periodType || ''}
                            startDate={period.startTime || ''}
                            endDate={period.endTime || ''}
                            calendar={calendar}
                            orgLevel={orgUnits.levelName || ''}
                            orgUnit={
                                orgUnits.parent.displayName ||
                                orgUnits.parent.name ||
                                ''
                            }
                            dataElement={dataElement.displayName || ''}
                            totalValues={valueCount}
                        />
                    )}
                    <div>
                        <Button
                            primary
                            disabled={!isValid || startExtract}
                            onClick={() => setStartExtract(true)}
                        >
                            {i18n.t('Start import')}
                        </Button>
                        {startExtract && isValid && (
                            <ExtractData
                                dataset={dataset}
                                period={dataset.period ? null : standardPeriod}
                                orgUnits={orgUnits}
                                dataElement={dataElement}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportPage
