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
    periodTypes,
    fromStandardDate,
    toDateObject,
    formatStandardDate,
    DAILY,
    MONTHLY,
    YEARLY,
    oneDayInMs,
} from '../../utils/time.js'
import Dataset from '../shared/Dataset.jsx'
import GEETokenCheck from '../shared/GEETokenCheck.jsx'
import Resolution from '../shared/Resolution.jsx'
import SectionH2 from '../shared/SectionH2.jsx'
import DataElement from './DataElement.jsx'
import Dhis2DataSet from './Dhis2DataSet.jsx'
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
    const [dhis2DataSet, setDhis2DataSet] = useState()
    const standardPeriod = getStandardPeriod(period) // ISO 8601 used by GEE
    const [startExtract, setStartExtract] = useState(false)

    const hasNoPeriod = dataset?.periodType === 'N/A'

    const orgUnitCount = useOrgUnitCount(orgUnits?.parent?.id, orgUnits?.level)
    const periodCount = useMemo(
        () => (hasNoPeriod ? 0 : getPeriods(period).length),
        [period, hasNoPeriod]
    )
    const valueCount = orgUnitCount * periodCount
    const periodTypeName = periodTypes
        .find((type) => type.id === period.periodType)
        ?.name.toLowerCase()

    const isValidOrgUnits =
        orgUnits?.parent &&
        orgUnits.level &&
        orgUnits.parent.path.split('/').length - 1 <= Number(orgUnits.level)

    const isValid = !!(
        dataset &&
        (hasNoPeriod || isValidPeriod(standardPeriod)) &&
        isValidOrgUnits &&
        dataElement &&
        valueCount <= maxValues
    )

    useEffect(() => {
        setStartExtract(false)
    }, [dataset, period, orgUnits, dataElement])

    const updateDhis2DSandDE = useCallback((ds) => {
        setDhis2DataSet(ds)
        setDataElement(null)
    }, [])

    const updatePeriod = (val) => {
        if (val.periodType !== period.periodType) {
            setDhis2DataSet(null)
            setDataElement(null)
            setPeriod(val)
        }
    }

    const updateDataset = useCallback(
        (dataset) => {
            const updatePeriodSelector = ({ periodRange, periodType }) => {
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
                    setPeriod(getDefaultImportPeriod(calendar))
                }
            }

            setDataset(dataset)
            setDhis2DataSet(null)
            setDataElement(null)
            updatePeriodSelector(dataset)
        },
        [calendar, period.locale]
    )

    return (
        <div className={classes.page}>
            <h1>{i18n.t('Import weather and climate data')}</h1>
            <GEETokenCheck />
            <div>
                <div className={classes.formContainer}>
                    <Dataset
                        title={i18n.t('Choose data source')}
                        selected={dataset}
                        onChange={updateDataset}
                    />
                </div>
                <div className={classes.formContainer}>
                    <Period
                        period={period}
                        dataset={dataset}
                        onChange={(val) => updatePeriod(val)}
                    />
                </div>
                <div className={classes.formContainer}>
                    <SectionH2
                        number="3"
                        title={i18n.t('Choose destination data element')}
                    />
                    <Dhis2DataSet
                        selected={dhis2DataSet}
                        onChange={updateDhis2DSandDE}
                        periodType={period.periodType}
                        dataset={dataset}
                    />
                    <DataElement
                        selected={dataElement}
                        dataElements={dhis2DataSet?.dataSetElements}
                        onChange={setDataElement}
                        datasetCode={dataset?.dataElementCode}
                    />
                </div>
                <div className={classes.formContainer}>
                    <OrgUnits selected={orgUnits} onChange={setOrgUnits} />
                    {valueCount > maxValues && (
                        <div className={classes.warning}>
                            {i18n.t(
                                'You can import a maximum of {{maxValues}} data values in a single import, but you are trying to import {{valueCount}} values for {{orgUnitCount}} organisation units over {{periodCount}} {{periodTypeName}} periods. Please select a shorter period or fewer organisation units. You can always import more data later.',
                                {
                                    maxValues,
                                    valueCount,
                                    orgUnitCount,
                                    periodCount,
                                    periodTypeName,
                                }
                            )}
                        </div>
                    )}
                    {dataset && (
                        <Resolution
                            resolution={dataset.resolution}
                            isImport={true}
                        />
                    )}
                </div>
                <div className={classes.formContainer}>
                    <SectionH2 number="5" title={i18n.t('Review and import')} />
                    {isValid && !startExtract && (
                        <ImportPreview
                            dataset={dataset.name || ''}
                            periodType={period.periodType || ''}
                            startDate={period.startTime || ''}
                            endDate={period.endTime || ''}
                            orgLevel={orgUnits.levelName || ''}
                            orgUnit={
                                orgUnits.parent.displayName ||
                                orgUnits.parent.name ||
                                ''
                            }
                            dataElement={dataElement.displayName || ''}
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
                                period={hasNoPeriod ? null : standardPeriod}
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
