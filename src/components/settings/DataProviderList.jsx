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
import { useDataSources } from '../DataSourcesProvider.jsx'
import DataProviderListItem from './DataProviderListItem.jsx'

const DataProviderList = () => {
    const sources = useDataSources()

    const { gee, enacts } = sources

    const dataProviders = Object.values(sources).map((item) => {
        let status = ''

        if (item.id === gee.id) {
            if (gee.enabled === null) {
                status = 'Offline'
            } else if (gee.enabled === false) {
                status = 'Not configured'
            } else {
                status = 'Online'
            }
        } else {
            // enacts
            if (!enacts.route) {
                status = 'Not configured'
            } else if (enacts.info?.status === 'OK') {
                status = 'Online'
            } else {
                status = 'Offline'
            }
        }

        return {
            name: item.name,
            status,
        }
    })

    return (
        <div>
            <h2>{i18n.t('Data Providers')}</h2>
            <Field
                label={i18n.t(
                    'The following data providers can be configured and used in the Climate app. Contact your administrator to configure these data providers.'
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
                        {dataProviders.map((provider) => (
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
