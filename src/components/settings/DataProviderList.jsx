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
import DataProviderListItem from './DataProviderListItem.jsx'

const DEFAULT_DATA_PROVIDERS = []

const DataProviderList = ({ dataProviders = DEFAULT_DATA_PROVIDERS }) => {
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
                        {dataProviders.map((provider) => (
                            <DataProviderListItem
                                key={provider.name}
                                dataProvider={provider}
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
