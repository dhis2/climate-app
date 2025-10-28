import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card, Button } from '@dhis2/ui'
import { useState, useMemo, useEffect } from 'react'
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
import DataElement from './DataElement.jsx'
import ExtractData from './ExtractData.jsx'
import OrgUnits from './OrgUnits.jsx'
import Period from './Period.jsx'
import styles from './styles/ImportPage.module.css'

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
        orgUnits?.level &&
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

    const updatePeriod = ({ periodRange, periodType }) => {
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
                    startTime = fromStandardDate(periodRange.start, calendar)
                }
            } catch (e) {
                // if anything goes wrong, fallback to original values
                console.warn(
                    'Failed to compute relative startTime, falling back',
                    e
                )
                startTime = fromStandardDate(periodRange.start, calendar)
                endTime = fromStandardDate(periodRange.end, calendar)
            }

            const newPeriod = {
                periodType,
                calendar,
                locale: period.locale,
                startTime,
                endTime,
            }
            setPeriod(newPeriod)
        } else {
            setPeriod(getDefaultImportPeriod(calendar))
        }
    }

    return (
        <div className={styles.page}>
            <h1>{i18n.t('Import weather and climate data')}</h1>
            <GEETokenCheck />
            <div className={styles.column}>
                <Card className={styles.card}>
                    <div className={styles.container}>
                        <Dataset
                            title={i18n.t('Data')}
                            selected={dataset}
                            onChange={(dataset) => {
                                setDataset(dataset)
                                setDataElement(null)
                                updatePeriod(dataset)
                            }}
                        />
                        <Period
                            period={period}
                            dataset={dataset}
                            onChange={setPeriod}
                        />
                        <OrgUnits selected={orgUnits} onChange={setOrgUnits} />
                        {valueCount > maxValues && (
                            <div className={styles.warning}>
                                {i18n.t(
                                    'You can maximum import {{maxValues}} data values in a single import, but you are trying to import {{valueCount}} values for {{orgUnitCount}} organisation units over {{periodCount}} {{periodTypeName}} periods. Please select a shorter period or fewer organisation units. You can always import more data later.',
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
                        <DataElement
                            selected={dataElement}
                            dataset={dataset}
                            onChange={setDataElement}
                        />
                        <div className={styles.import}>
                            <Button
                                primary
                                disabled={!isValid || startExtract}
                                onClick={() => setStartExtract(true)}
                            >
                                Start import
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
                </Card>
                <div className={styles.instructions}>
                    <h2>{i18n.t('Instructions')}</h2>
                    <p>
                        {i18n.t(
                            'Before you can import data, you need to create the associated data elements in DHIS2. See our setup guide in the left menu.'
                        )}
                    </p>
                    <p>
                        {i18n.t(
                            'Data can be imported in batches. We recommend that you start with a few organisation units to make sure everything works as expected.'
                        )}
                    </p>
                    <p>
                        <strong>{i18n.t('Data')}</strong>:{' '}
                        {i18n.t(
                            'Select the variable you would like to import.'
                        )}
                    </p>
                    <p>
                        <strong>{i18n.t('Period')}</strong>:{' '}
                        {i18n.t(
                            'Select the start and end dates for your import. We will import daily data for the selected period. You can aggregate data to other period types (weekly/monthly) in DHIS2. If your DHIS2 instance use a different timezone than UTC, we will calculate daily values based on this timezone.'
                        )}
                    </p>
                    <p>
                        <strong>{i18n.t('Parent organisation unit')}</strong>:{' '}
                        {i18n.t(
                            'Select a parent organisation unit for the import. We will import data for children that are below this organisation unit.'
                        )}
                    </p>
                    <p>
                        <strong>{i18n.t('Organisation unit level')}</strong>:{' '}
                        {i18n.t(
                            'Select the organisation unit level for the import. We will import data for this level that are below the parent organisation unit. If the parent organisation unit is on the same level, we will import data for this single organisation unit.'
                        )}
                    </p>
                    <p>
                        <strong>{i18n.t('Data element')}</strong>:{' '}
                        {i18n.t(
                            'Select the DHIS2 data element you would like to import the data into. See the “Setup guide” for more information on how to configure this data element.'
                        )}
                    </p>
                    <p>
                        <strong>{i18n.t('Import summary')}</strong>:{' '}
                        {i18n.t(
                            'When data is imported, we will show a summary of the import. This includes the number of data values that were successfully imported or updated. If data values fail to import, we will show the reason for the failure.'
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ImportPage
