import i18n from '@dhis2/d2-i18n'
import {
    Field,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@dhis2/ui'
import React from 'react'
import { dataProviders } from '../../data/providers.js'
import { useDataSources } from '../DataSourcesProvider.jsx'
import DataProviderListItem from './DataProviderListItem.jsx'

const DataProviderList = () => {
    const { hasGeeToken, enactsRoute, enactsInfo } = useDataSources()
    // fill in data provider details based on route codes in routes api
    const dataProvidersUpdated = dataProviders.map((item) => {
        const name = item.name
        let status = 'Not configured'

        if (item.id === 'gee') {
            if (hasGeeToken === null) {
                status = 'Offline'
            } else if (hasGeeToken === false) {
                status = 'Not configured'
            } else {
                status = 'Online'
            }
        } else if (item.id === 'enacts') {
            if (!enactsRoute) {
                status = 'Not configured'
            } else if (enactsInfo && enactsInfo.status === 'OK') {
                status = 'Online'
            } else {
                status = 'Offline'
            }
        }

        return {
            name,
            status,
        }
    })

    return (
        <div>
            <h2>{i18n.t('Data Providers')}</h2>
            <Field
                label={i18n.t(
                    'The following data providers can be configured and used in the Climate app. Contact your administrator to add or update data providers.'
                )}
            ></Field>

            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{i18n.t('Provider name')}</TableCell>
                            <TableCell>{i18n.t('Status')}</TableCell>
                            <TableCell>{i18n.t('Setup info')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataProvidersUpdated.map((provider) => (
                            <DataProviderListItem
                                key={provider.name}
                                name={provider.name}
                                status={provider.status}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DataProviderList
