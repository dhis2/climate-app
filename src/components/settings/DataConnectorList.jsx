import React, { useState } from 'react'
import { Input, Button, Field, Divider } from '@dhis2/ui'
import DataConnectorListItem from './DataConnectorListItem.jsx'
import styles from './styles/DataConnectorList.module.css'

const DataConnectorList = ({ dataConnectors = [], onChange }) => {
    const [inputUrl, setInputUrl] = useState('')
    const [newConnectorMetadata, setNewConnectorMetadata] = useState({})

    const fetchConnectorMetadata = async (url) => {
        const metaUrl = url + '/meta'
        const response = await fetch(metaUrl)
    
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`)
        }
    
        return await response.json()
    }

    const addConnector = async () => {
        const url = inputUrl.trim()
        if (!url || dataConnectors.some(conn => conn.url === url)) return

        try {
            const metadata = await fetchConnectorMetadata(url)
    
            // Add the URL into the metadata object (if not already there)
            const newConnector = { ...metadata, url }
    
            console.log('Adding new connector', newConnector)
    
            const updatedList = [...dataConnectors, newConnector]
            onChange('dataConnectors', updatedList)
            setInputUrl('')
        } catch (error) {
            alert('Error connecting to server: ' + error.message)
        }
    }

    const removeConnector = (connectorToRemove) => {
        const updatedList = dataConnectors.filter(conn => conn.url !== connectorToRemove.url)
        onChange('dataConnectors', updatedList)
    }

    return (
        <div>
            <h2>Data Connections</h2>

            <Field label="In addition to the builtin climate data sources, you can connect to one or more DHIS2 climate data servers."></Field>

            <div>
                {dataConnectors.map((connector) => (
                    <DataConnectorListItem dataConnector={connector} onRemove={removeConnector} />
                ))}
                
                <div className={styles.newConnectorForm}>
                    <Input
                        value={inputUrl}
                        onChange={({ value }) => setInputUrl(value)}
                        placeholder="https://example.org/climate-api"
                    />
                    <Button onClick={addConnector} primary>
                        New Connection
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DataConnectorList
