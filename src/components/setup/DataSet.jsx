import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { getPeriodTypes } from '../../utils/time.js'

const DataSet = ({ name, shortName, periodType }) => {
    const periodTypeName =
        getPeriodTypes().find((pt) => pt.id === periodType)?.name || periodType

    return (
        <>
            <h2>{i18n.t('3. Assign to a DHIS2 data set')}</h2>
            <p>
                {i18n.t(
                    'Here is the recommended configuration for a DHIS2 data set to assign the DHIS2 data element to:'
                )}
            </p>
            <table>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: colors.grey200 }}>
                            {i18n.t('Data set field')}
                        </th>
                        <th style={{ backgroundColor: colors.grey200 }}>
                            {i18n.t('Value')}
                        </th>
                        <th style={{ backgroundColor: colors.grey200 }}>
                            {i18n.t('Note')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{i18n.t('Name')}</th>
                        <td>{`${name} ${periodTypeName}`}</td>
                        <td>
                            {i18n.t(
                                'The same DHIS2 data set can be used for all the "{{-name}} {{-periodTypeName}}" related data elements',
                                { name, periodTypeName }
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Short name')}</th>
                        <td>{`${shortName} ${periodTypeName}`}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Period type')}</th>
                        <td>{periodTypeName}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Data elements')}</th>
                        <td>
                            <em>{i18n.t('Assign above data element')}</em>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Organisation units')}</th>
                        <td>
                            <em>
                                {i18n.t(
                                    'Select all organisation units in your system'
                                )}
                            </em>
                        </td>
                        <td>
                            {i18n.t(
                                'Assign all organisation units since data can be provided for any unit with defined geographic boundaries.'
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

DataSet.propTypes = {
    name: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
}

export default DataSet
