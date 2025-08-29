import React, { useState } from 'react'
import { Input, Button, Field, Divider } from '@dhis2/ui'
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@dhis2/ui'
import DataProviderListItem from './DataProviderListItem.jsx'
import styles from './styles/DataProviderList.module.css'

const DataProviderList = ({ dataProviders = [] }) => {
    // exclude google earth engine so we only list additional providers
    dataProviders = dataProviders.filter(provider => provider.id != 'gee')

    return (
        <div>
            <h2>Additional Data Providers</h2>

            <Field label="In addition to the builtin Google Earth Engine datasets, you can connect to additional climate data APIs listed below. Use the Route Manager app to customize the API URL and user credentials."></Field>

            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Provider Name</TableCell>
                            <TableCell>Route Code</TableCell>
                            <TableCell>URL</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataProviders.map((provider, index) => (
                            <DataProviderListItem key={index} dataProvider={provider} index={index} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DataProviderList