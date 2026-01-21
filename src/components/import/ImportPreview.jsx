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
    orgUnits,
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

    const { parent: orgUnitParent, levelName: orgLevelName, level } = orgUnits

    const orgUnitInfo =
        orgUnitParent.level !== Number(level)
            ? i18n.t(
                  'For all organisation units at {{orgLevelName}} level within {{orgUnitParent}}',
                  {
                      orgLevelName: orgLevelName.toLowerCase(),
                      orgUnitParent:
                          orgUnitParent.displayName || orgUnitParent.name,
                      interpolation: { escapeValue: false },
                  }
              )
            : i18n.t('For {{orgUnitParent}} {{orgLevelName}}', {
                  orgUnitParent:
                      orgUnitParent.displayName || orgUnitParent.name,
                  orgLevelName: orgLevelName.toLowerCase(),
                  interpolation: { escapeValue: false },
              })

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
    orgUnits: PropTypes.shape({
        level: PropTypes.string,
        levelName: PropTypes.string,
        parent: PropTypes.shape({
            displayName: PropTypes.string,
            level: PropTypes.number,
            name: PropTypes.string,
            path: PropTypes.string,
        }),
    }).isRequired,
    periodType: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    totalValues: PropTypes.number.isRequired,
    calendar: PropTypes.string,
}

export default ImportPreview
