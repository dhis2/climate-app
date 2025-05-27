import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

const DataSet = ({ name, shortName, periodType }) => (
    <>
        <h2>{i18n.t('Assign to a data set')}</h2>
        <p>
            {i18n.t(
                'If you import daily data, you should assign the data elements to a daily data set (weather and climate). For weekly or monthly data, assign to a weekly or monthly data set (vegetation index). Assigning to a data set helps to maintain a quality metadata and data where integrity, consistency, approvals and protection are facilitated. How exactly to define such a data set depends on the available users and user groups. Similarly, which of the organisation units can collect this daily climate data set depends on situated contexts. However, since we can provide data for any administrative unit that has defined geographic boundaries we leave that decision to users. Most probable choice is all organisation units in your system.'
            )}
        </p>
        <table>
            <caption>
                {i18n.t('Data set: "{{-name}}"', { name, nsSeparator: '%' })}
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
                    <th>{i18n.t('Period type')}</th>
                    <td>{periodType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Data elements')}</th>
                    <td>
                        <em>{i18n.t('Assign above data element')}</em>
                    </td>
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
                </tr>
            </tbody>
        </table>
    </>
)

DataSet.propTypes = {
    name: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
}

export default DataSet
