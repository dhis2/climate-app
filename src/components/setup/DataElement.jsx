import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import DataElementGroup from './DataElementGroup.jsx'
import DataSet from './DataSet.jsx'
import Legend from './Legend.jsx'

const DataElement = ({
    name,
    shortName,
    dataElementCode,
    description,
    source,
    aggregationType,
    dataElementGroup,
    dataSet,
    legend,
}) => (
    <>
        <table>
            <caption>
                {i18n.t('Data element: "{{name}}"', {
                    name,
                    nsSeparator: '%',
                    interpolation: { escapeValue: false },
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
                    <th>{i18n.t('Code')}</th>
                    <td>{dataElementCode}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Description')}</th>
                    <td>
                        {description}
                        <br />
                        {i18n.t('Data source')}: {source}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Domain type')}</th>
                    <td>{i18n.t('Aggregate')}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation type')}</th>
                    <td>{aggregationType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Store zero data values')}</th>
                    <td>
                        <em>{i18n.t('Make sure it is checked')}</em>
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation levels')}</th>
                    <td>
                        <em>{i18n.t('Assign all org unit levels')}</em>
                    </td>
                </tr>
            </tbody>
        </table>
        <DataSet {...dataSet} />
        <DataElementGroup {...dataElementGroup} />
        {legend && <Legend {...legend} />}
        <p>
            {i18n.t(
                'You should now be able to import data with this app. Please reach out to us on climate-app@dhis2.org if you have any questions or need help with the setup.'
            )}
        </p>
    </>
)

DataElement.propTypes = {
    aggregationType: PropTypes.string.isRequired,
    dataElementCode: PropTypes.string.isRequired,
    dataElementGroup: PropTypes.object.isRequired,
    dataSet: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    legend: PropTypes.object,
}

export default DataElement
