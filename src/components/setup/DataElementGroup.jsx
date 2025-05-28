import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

const DataElementGroup = ({ name, shortName }) => (
    <>
        <h2>{i18n.t('3. Assign to a data element group')}</h2>
        <p>
            {i18n.t(
                'To be able to select the data elements in all the DHIS2 analytics apps you also need to assign them to a data element group:'
            )}
        </p>
        <table>
            <caption>
                {i18n.t('Data element group: "{{-name}}"', {
                    name,
                    nsSeparator: '%',
                })}
            </caption>
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
