import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'

const DataElementGroup = ({ name, shortName }) => (
    <>
        <h2>{i18n.t('4. Assign to a DHIS2 data element group')}</h2>
        <p>
            {i18n.t(
                'To be able to select the data elements in all the DHIS2 analytics apps you need to assign them to a data element group. Here is the recommended configuration for the DHIS2 data element group "{{-name}}":',
                {
                    name,
                }
            )}
        </p>
        <table>
            <thead>
                <tr>
                    <th style={{ backgroundColor: colors.grey200 }}>
                        {i18n.t('Data element group field')}
                    </th>
                    <th style={{ backgroundColor: colors.grey200 }}>
                        {i18n.t('Value')}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>{i18n.t('Name')}</th>
                    <td>{name}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Short name')}</th>
                    <td>{shortName}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Data elements')}</th>
                    <td>
                        <em>{i18n.t('Assign above data element')}</em>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
)

DataElementGroup.propTypes = {
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
}

export default DataElementGroup
