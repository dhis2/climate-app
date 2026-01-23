import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { DAILY, YEARLY, getPeriodTypes } from '../../utils/time.js'
import classes from './ImportPreview.module.css'

const ImportPreview = ({
    dataset,
    periodType,
    startDate,
    endDate,
    orgUnits,
    dataElement,
    totalValues,
}) => {
    const periodTypeObj = getPeriodTypes().find(
        (type) => type.id === periodType
    )

    const { name: periodTypeName, noun: periodTypeNoun } = periodTypeObj

    const periodInfo =
        (periodType === DAILY || periodType === YEARLY) && endDate === startDate
            ? i18n.t('For the {{periodTypeNoun}} {{date}}', {
                  periodTypeNoun,
                  date: startDate,
              })
            : i18n.t(
                  '{{periodTypeName}} values between {{startDate}} and {{endDate}}',
                  {
                      periodTypeName,
                      startDate: startDate,
                      endDate: endDate,
                  }
              )

    const { parent: orgUnitParent, levelName: orgLevelName, level } = orgUnits

    const orgUnitInfo =
        orgUnitParent.level === Number(level)
            ? i18n.t('For {{orgUnitParent}} {{orgLevelName}}', {
                  orgUnitParent:
                      orgUnitParent.displayName || orgUnitParent.name,
                  orgLevelName: orgLevelName.toLowerCase(),
                  interpolation: { escapeValue: false },
              })
            : i18n.t(
                  'For all organisation units at {{orgLevelName}} level within {{orgUnitParent}}',
                  {
                      orgLevelName: orgLevelName.toLowerCase(),
                      orgUnitParent:
                          orgUnitParent.displayName || orgUnitParent.name,
                      interpolation: { escapeValue: false },
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
}

export default ImportPreview
