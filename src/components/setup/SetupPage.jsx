import i18n from '@dhis2/d2-i18n'
import datasets from '../../data/datasets'
import heatStressLegend from '../../data/heat-stress-legend'
import DataElement from './DataElement.jsx'
import Legend from './Legend.jsx'
import styles from './styles/SetupPage.module.css'

const SetupPage = () => {
    return (
        <div className={styles.container}>
            <h1>{i18n.t('How to configure this app')}</h1>
            <p>
                {i18n.t(
                    'Before you can import weather and climate data, you need to make some configurations in the Maintenance app.'
                )}
            </p>
            <p>
                {i18n.t(
                    "This app imports daily weather and climate data that can be aggregated to other period types in DHIS2. We don't recommend aggregating across organisation unit levels, especially when going from facility level to higher levels defined by a geographic boundary. To make sure the values remain at its own level, assign all org unit levels as Aggregation levels for each data element below."
                )}
            </p>
            <p>
                {i18n.t(
                    'Create DHIS2 data elements for the climate and weather data you want to import. We recommend including the data source in the name to distinguish it from data imported from local weather stations. If you use the same code specified below, we will preselect the data element in the import interface.'
                )}
            </p>
            {datasets.map((dataset) => (
                <DataElement key={dataset.id} {...dataset} />
            ))}
            <p>
                Since these data elements are collected daily, we recommend they
                are assigned to a daily data set. Assigning to a data set helps
                to maintain a quality metadata and data where integrity,
                consistency, approvals and protection are facilitated. How
                exactly to define such a data set depends on the available users
                and user groups. Similarly, which of the organisation units can
                collect this daily climate data set depends on situated
                contexts. However, since we can provide data for any
                administrative unit that has defined geographic boundaries we
                leave that decision to users. Most probable choice is all
                organisation units in your system.
            </p>
            <table>
                <caption>
                    {i18n.t('Data set')}: &quot;{i18n.t('Climate/Weather')}
                    &quot;
                </caption>
                <tbody>
                    <tr>
                        <th>{i18n.t('Name')}</th>
                        <td>{i18n.t('Climate/Weather')}</td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Short name')}</th>
                        <td>{i18n.t('Climate/Weather')}</td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Period type')}</th>
                        <td>{i18n.t('Daily')}</td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Data elements')}</th>
                        <td>
                            <em>{i18n.t('Assign the above data elements')}</em>
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
            <p>
                {i18n.t(
                    'To be able to select the data elements in all the DHIS2 analytics apps you also need to assign them to a data element group:'
                )}
            </p>
            <table>
                <caption>
                    {i18n.t('Data element group')}: &quot;
                    {i18n.t('Climate/Weather')}
                    &quot;
                </caption>
                <tbody>
                    <tr>
                        <th>{i18n.t('Name')}</th>
                        <td>{i18n.t('Climate/Weather')}</td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Short name')}</th>
                        <td>{i18n.t('Climate/Weather')}</td>
                    </tr>
                    <tr>
                        <th>{i18n.t('Data elements')}</th>
                        <td>
                            <em>{i18n.t('Assign the above data elements')}</em>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Legend {...heatStressLegend} />
            <p>
                {i18n.t(
                    'You should now be able to import climate data with this app. Please reach out to us on climate-app@dhis2.org if you have any questions or need help with the setup.'
                )}
            </p>
        </div>
    )
}

export default SetupPage
