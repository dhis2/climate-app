import React, { useEffect, useState } from 'react'
import { Input, Button, ButtonStrip, Field, Divider, Card, CircularLoader } from '@dhis2/ui'
import {
    TableRow,
    TableCell,
} from '@dhis2/ui'
import styles from './styles/DataProviderListItem.module.css'
import { InputField } from '@dhis2/ui'

const DataProviderListItem = ({ dataProvider, index }) => {
    const [providerStatus,setProviderStatus] = useState(undefined)

    const pingDataProvider = async () => {
        if (dataProvider?.href) {
            const pingUrl = `${dataProvider.href}/run` // not sure if the base url is enough for pinging
            fetch(pingUrl, {credentials: 'include'}) // needed to pass on dhis2 login credentials
            .then(response => {
                //console.log('pinging', pingUrl, response.ok, response)
                if (response.ok) {setProviderStatus('Online')}
                else {setProviderStatus('Offline')}
            })
            .catch(error => {setProviderStatus('Offline')})
        } else {
            setProviderStatus('Missing')
        }
    }

    useEffect(() => {
        pingDataProvider()
    }, [])

    const statusClassMap = {
        Online: styles.dataProviderOnline,
        Offline: styles.dataProviderOffline,
        Missing: styles.dataProviderMissing,
    }

    const statusClass = statusClassMap[providerStatus]
    console.log(statusClass)

    return (
            <TableRow>
                <TableCell>
                    {index + 1}
                </TableCell>

                <TableCell>
                    {dataProvider.name}
                </TableCell>

                <TableCell>
                    {dataProvider.routeCode}
                </TableCell>

                <TableCell>
                    {(dataProvider?.url !== undefined) ? String(dataProvider.url) : `<Please go to the Routes API and register a Route with the code "${dataProvider.routeCode}">`}
                </TableCell>

                <TableCell>
                    <div className={`${styles.dataProviderStatusDiv}`}>
                        {providerStatus && (
                            <div className={`${styles.dataProviderStatusIcon} ${statusClass}`}></div>
                        )}
                        {providerStatus && (
                            <span>{providerStatus}</span>
                        )}
                        {!providerStatus && (
                            <CircularLoader extrasmall={true}/>
                        )}
                    </div>
                </TableCell>
            </TableRow>
    )
}

export default DataProviderListItem