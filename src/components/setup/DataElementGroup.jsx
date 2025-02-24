import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

const DataElementGroup = ({ name, shortName, dataElements }) => (
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
                    <em>{dataElements}</em>
                </td>
            </tr>
        </tbody>
    </table>
)

DataElementGroup.propTypes = {
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
    dataElements: PropTypes.string.isRequired,
}

export default DataElementGroup
