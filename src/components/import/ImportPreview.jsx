import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { getOuText } from '../../utils/getOuText.js'
import {
    DAILY,
    WEEKLY,
    MONTHLY,
    YEARLY,
    getPeriodTypes,
    getPeriods,
} from '../../utils/time.js'
import classes from './ImportPreview.module.css'

const ImportPreview = ({
    dataset,
    periodType,
    startDate,
    endDate,
    featureCount,
    dataElement,
    totalValues,
    orgUnits,
}) => {
    const periodTypeObj = getPeriodTypes().find(
        (type) => type.id === periodType
    )

    const { name: periodTypeName, noun: periodTypeNoun } = periodTypeObj

    // Calculate actual period boundaries for weekly/monthly
    let periodInfo
    if (periodType === WEEKLY || periodType === MONTHLY) {
        const periods = getPeriods({
            periodType,
            startTime: startDate,
            endTime: endDate,
        })
        const firstPeriod = periods[0]
        const lastPeriod = periods[periods.length - 1]

        // Format period ID for display (e.g., "2025W1" -> "2025-W01", "202502" -> "2025-02")
        const formatPeriodId = (id) => {
            if (periodType === WEEKLY) {
                // Convert "2025W1" to "2025-W01" (zero-pad week number)
                return id.replace(
                    /^(\d{4})W(\d{1,2})$/,
                    (match, year, week) => `${year}-W${week.padStart(2, '0')}`
                )
            } else if (periodType === MONTHLY) {
                // Convert "202502" to "2025-02"
                return id.replace(/^(\d{4})(\d{2})$/, '$1-$2')
            }
            return id
        }

        if (periods.length === 1) {
            const periodId = formatPeriodId(firstPeriod.id)
            periodInfo = i18n.t(
                'For {{periodId}} ({{actualStartTime}} to {{actualEndTime}})',
                {
                    periodId,
                    actualStartTime: firstPeriod.startDate,
                    actualEndTime: firstPeriod.endDate,
                }
            )
        } else {
            const startPeriodId = formatPeriodId(firstPeriod.id)
            const endPeriodId = formatPeriodId(lastPeriod.id)
            periodInfo = i18n.t(
                '{{periodTypeName}} values from {{startPeriodId}} to {{endPeriodId}} ({{actualStartTime}} to {{actualEndTime}})',
                {
                    periodTypeName,
                    startPeriodId,
                    endPeriodId,
                    actualStartTime: firstPeriod.startDate,
                    actualEndTime: lastPeriod.endDate,
                }
            )
        }
    } else if (
        (periodType === DAILY || periodType === YEARLY) &&
        endDate === startDate
    ) {
        periodInfo = i18n.t('For the {{periodTypeNoun}} {{date}}', {
            periodTypeNoun,
            date: startDate,
        })
    } else {
        periodInfo = i18n.t(
            '{{periodTypeName}} values between {{startDate}} and {{endDate}}',
            {
                periodTypeName,
                startDate: startDate,
                endDate: endDate,
            }
        )
    }

    const orgUnitInfo = i18n.t(
        'Selected org units: {{ouText}} ({{count}} organisation units have geometry and will be imported)',
        {
            ouText: getOuText(orgUnits),
            count: featureCount,
            defaultValue:
                'Selected org units: {{ouText}} ({{count}} organisation unit has geometry and will be imported)',
            defaultValue_plural:
                'Selected org units: {{ouText}} ({{count}} organisation units have geometry and will be imported)',
            interpolation: { escapeValue: false },
            nsSeparator: '<<',
        }
    )

    return (
        <div data-test="import-preview">
            <div className={classes.datasetlead}>
                {i18n.t('"{{dataset}}" source data will be imported:', {
                    dataset,
                    interpolation: { escapeValue: false },
                })}
            </div>
            <ul className={classes.list}>
                <li className={classes.listItem}>{periodInfo}</li>
                <li className={classes.listItem}>{orgUnitInfo}</li>
                <li className={classes.listItem}>
                    {i18n.t('To data element "{{dataElement}}"', {
                        dataElement,
                        interpolation: { escapeValue: false },
                    })}
                </li>
                <li className={classes.listItem}>
                    {i18n.t('{{count}} data values will be imported', {
                        count: totalValues,
                        defaultValue: '{{count}} data value will be imported',
                        defaultValue_plural:
                            '{{count}} data values will be imported',
                    })}
                </li>
            </ul>
        </div>
    )
}

ImportPreview.propTypes = {
    dataElement: PropTypes.string.isRequired,
    dataset: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    featureCount: PropTypes.number.isRequired,
    orgUnits: PropTypes.array.isRequired,
    periodType: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    totalValues: PropTypes.number.isRequired,
}

export default ImportPreview
