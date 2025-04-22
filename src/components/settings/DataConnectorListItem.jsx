import React, { useEffect, useState } from 'react'
import { Input, Button, ButtonStrip, Field, Divider, Card, CircularLoader } from '@dhis2/ui'
import styles from './styles/DataConnectorListItem.module.css'

const DataConnectorListItem = ({ dataConnector, onRemove }) => {
    const [connectorStatus,setConnectorStatus] = useState(undefined)

    const pingDataConnector = async () => {
        const pingUrl = dataConnector.url + '/ping'
        fetch(pingUrl)
        .then(response => {
            if (response.ok) {setConnectorStatus('Online')}
            else {setConnectorStatus('Offline')}
        })
        .catch(error => {setConnectorStatus('Offline')})
    }

    useEffect(() => {
        if (dataConnector?.url) {
            pingDataConnector()
        }
    }, [dataConnector?.url]) // run whenever the connector URL changes

    return (
        <Card className={styles.dataConnectorCard}>
            <h3>URL: {dataConnector.url}</h3>
                <div className={styles.dataConnectorStatusDiv}>
                    <span>Status: </span>
                    {connectorStatus && (
                        <div className={`${styles.dataConnectorStatusIcon} ${connectorStatus=='Online' ? styles.dataConnectorOnline : styles.dataConnectorOffline}`}></div>
                    )}
                    {connectorStatus && (
                        <span>{connectorStatus}</span>
                    )}
                    {!connectorStatus && (
                        <CircularLoader extrasmall={true}/>
                    )}
                </div>

            <span>
                <span>Server ID: </span>
                {dataConnector.id}
            </span>

            <span>
                <span>Server Name: </span>
                {dataConnector.name}
            </span>

            {dataConnector.description && (
                <p>{dataConnector.description}</p>
            )}
            
            <ButtonStrip className={styles.buttons}>
                <Button
                    small
                    destructive
                    onClick={() => onRemove(dataConnector)}
                    style={{ marginLeft: 8 }}
                >
                    Remove
                </Button>
            </ButtonStrip>
        </Card>
    )
}

export default DataConnectorListItem
