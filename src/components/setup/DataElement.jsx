import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
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
    periodType,
}) => {
    const codeWithPeriodType = `${dataElementCode}_${periodType.toUpperCase()}`

    return (
        <>
            <p>
                {i18n.t(
                    'Here is the configuration for a DHIS2 data element for the "{{-name}}" dataset:',
                    { name }
                )}
            </p>
            <table>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: colors.grey200 }}>
                            {i18n.t('Data element field')}
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
                        <td>{name}</td>
                        <td>
                            {i18n.t(
                                'Include the data source in the name to distinguish it from other sources (e.g. precipitation data is available from both ERA5-Land and CHIRPS).'
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Short name')}</th>
                        <td>{shortName}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Code')}</th>
                        <td>{codeWithPeriodType}</td>
                        <td>
                            {i18n.t(
                                'If you use this code, this data element will be autoselected in the import form when choosing the "{{-name}}" dataset.',
                                { name }
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Description')}</th>
                        <td>
                            {description}
                            <br />
                            {i18n.t('Data source')}: {source}
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Domain type')}</th>
                        <td>{i18n.t('Aggregate')}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Aggregation type')}</th>
                        <td>{aggregationType}</td>
                        <td>
                            {!aggregationType &&
                                i18n.t(
                                    'Use your domain knowledge to select the appropriate aggregation type'
                                )}
                        </td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Store zero data values')}</th>
                        <td>
                            <em>{i18n.t('Make sure it is checked')}</em>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Aggregation levels')}</th>
                        <td>
                            <em>{i18n.t('Assign all org unit levels')}</em>
                        </td>
                        <td>
                            {i18n.t(
                                'Assign all to prevent aggregation across organisation unit levels, especially from facility to higher levels defined by a geographic boundary.'
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <DataSet {...dataSet} periodType={periodType} />
            <DataElementGroup {...dataElementGroup} />
            {legend && <Legend {...legend} />}
            <p>
                {i18n.t(
                    'You should now be able to import data with this app. Please reach out to us on climate-app@dhis2.org if you have any questions or need help with the setup.'
                )}
            </p>
        </>
    )
}

DataElement.propTypes = {
    aggregationType: PropTypes.string.isRequired,
    dataElementCode: PropTypes.string.isRequired,
    dataElementGroup: PropTypes.object.isRequired,
    dataSet: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    legend: PropTypes.object,
}

export default DataElement
