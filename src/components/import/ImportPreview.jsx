import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { periodTypes } from '../../utils/time.js'
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
}) => {
    const periodTypeData = periodTypes.find((type) => type.id === periodType)
    const periodNoun = periodTypeData?.noun || periodType

    return (
        <div>
            <div className={classes.datasetlead}>
                {i18n.t('"{{dataset}}" source data will be imported:', {
                    dataset,
                })}
            </div>
            <ul className={classes.list}>
                <li className={classes.listItem}>
                    {i18n.t(
                        'For every {{periodNoun}} between {{startDate}} and {{endDate}}',
                        {
                            periodNoun,
                            startDate,
                            endDate,
                        }
                    )}
                </li>
                <li className={classes.listItem}>
                    {i18n.t(
                        'To all organisation units at {{orgLevel}} level within {{orgUnit}}',
                        {
                            orgLevel,
                            orgUnit,
                        }
                    )}
                </li>
                <li className={classes.listItem}>
                    {i18n.t('To data element "{{dataElement}}"', {
                        dataElement,
                    })}
                </li>
                <li className={classes.listItem}>
                    {totalValues === 1
                        ? i18n.t('1 data value will be imported')
                        : i18n.t(
                              'A total of {{totalValues}} data values will be imported',
                              {
                                  totalValues,
                              }
                          )}
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
}

export default ImportPreview
