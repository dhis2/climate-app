import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import {
    WEEKLY,
    MONTHLY,
    getPeriodTypes,
    getPeriods,
    getStandardPeriod,
} from '../../utils/time.js'
import classes from './ImportPreview.module.css'

const ImportPreview = ({
    dataset,
    periodType,
    startDate,
    endDate,
    orgLevel,
    orgUnit,
    dataElement,
    totalValues,
    calendar = 'gregory',
}) => {
    const periodTypeData = getPeriodTypes().find(
        (type) => type.id === periodType
    )
    const periodNoun = periodTypeData?.noun || periodType

    // Format start and end based on period type
    // Get the actual periods that will be generated to show accurate start/end
    const formattedStart = startDate
    const formattedEnd = endDate
    let periodInfo = null

    if (periodType === WEEKLY || periodType === MONTHLY) {
        try {
            const standardPeriod = getStandardPeriod({
                startTime: startDate,
                endTime: endDate,
                calendar,
                periodType,
            })
            const periods = getPeriods(standardPeriod)

            if (periods.length > 0) {
                // Show both the DHIS2 period ID and the date range
                const firstPeriod = periods.at(0)
                const lastPeriod = periods.at(-1)

                periodInfo = {
                    firstPeriodId: firstPeriod.id,
                    lastPeriodId: lastPeriod.id,
                    firstStartDate: startDate,
                    lastEndDate: endDate,
                }
            }
        } catch (e) {
            // Fallback to original dates if period generation fails
            console.warn('Failed to generate periods for preview', e)
        }
    }

    const getPeriodInfo = () => {
        if (periodInfo) {
            return i18n.t(
                'For every {{periodNoun}} between {{firstStartDate}} ({{firstPeriodId}}) and {{lastEndDate}} ({{lastPeriodId}})',
                {
                    periodNoun,
                    firstStartDate: periodInfo.firstStartDate,
                    firstPeriodId: periodInfo.firstPeriodId,
                    lastEndDate: periodInfo.lastEndDate,
                    lastPeriodId: periodInfo.lastPeriodId,
                }
            )
        }

        if (endDate === startDate) {
            return i18n.t('For the {{periodNoun}} {{date}}', {
                periodNoun,
                date: formattedStart,
            })
        }

        return i18n.t(
            'For every {{periodNoun}} between {{startDate}} and {{endDate}}',
            {
                periodNoun,
                startDate: formattedStart,
                endDate: formattedEnd,
            }
        )
    }

    return (
        <div data-test="import-preview">
            <div className={classes.datasetlead}>
                {i18n.t('"{{dataset}}" source data will be imported:', {
                    dataset,
                    interpolation: { escapeValue: false },
                })}
            </div>
            <ul className={classes.list}>
                <li className={classes.listItem}>{getPeriodInfo()}</li>
                <li className={classes.listItem}>
                    {i18n.t(
                        'To all organisation units at {{orgLevel}} within {{orgUnit}}',
                        {
                            orgLevel,
                            orgUnit,
                            interpolation: { escapeValue: false },
                        }
                    )}
                </li>
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
    orgLevel: PropTypes.string.isRequired,
    orgUnit: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    totalValues: PropTypes.number.isRequired,
    calendar: PropTypes.string,
}

export default ImportPreview
