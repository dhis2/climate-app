import i18n from '@dhis2/d2-i18n'
import {
    Field,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { PROVIDER_GEE } from '../../data/providers.js'
import DataProviderListItem from './DataProviderListItem.jsx'

const DEFAULT_DATA_PROVIDERS = []

const DataProviderList = ({ dataProviders = DEFAULT_DATA_PROVIDERS }) => {
    // exclude google earth engine so we only list additional providers
    dataProviders = dataProviders.filter(
        (provider) => provider.id != PROVIDER_GEE
    )

    return (
        <div>
            <h2>{i18n.t('Additional Data Providers')}</h2>

            <Field
                label={i18n.t(
                    'In addition to the built-in Google Earth Engine datasets, you can connect to climate data APIs listed below. Use the Route Manager app to customize the API URL and user credentials.'
                )}
            ></Field>

            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>{i18n.t('Provider Name')}</TableCell>
                            <TableCell>{i18n.t('Route Code')}</TableCell>
                            <TableCell>{i18n.t('URL')}</TableCell>
                            <TableCell>{i18n.t('Status')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataProviders.map((provider, index) => (
                            <DataProviderListItem
                                key={index}
                                dataProvider={provider}
                                index={index}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

DataProviderList.propTypes = {
    dataProviders: PropTypes.array,
}

export default DataProviderList
