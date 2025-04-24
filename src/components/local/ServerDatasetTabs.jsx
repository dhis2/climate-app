import i18n from '@dhis2/d2-i18n'
import { TabBar, Tab } from '@dhis2/ui'
import { useState, useEffect, Outlet } from 'react'
import { fetchDataConnectorDatasets } from '../../utils/dataConnector'
import styles from './styles/DataConnectorTabs.module.css'
import { useLoaderData, Routes, Route, useParams, useNavigate } from 'react-router-dom'

const ServerDatasetTabs = ({ datasets }) => {
    const orgUnit = useLoaderData()
    const { serverId, datasetId } = useParams() // <- use this as selected
    const navigate = useNavigate()
    console.log('datasetId', datasetId)

    const handleChange = (value) => {
        navigate(`/local/${orgUnit.id}/${serverId}/${value}`)
    }

    return (
        <TabBar selected={datasetId} fixed scrollable>
            {datasets.map((d) => (
                <Tab
                    key={d.id}
                    label={d.shortName}
                    value={d.id}
                    onClick={() => handleChange(d.id)}
                >
                    {d.shortName}
                </Tab>
            ))}
        </TabBar>
    )
}

export default ServerDatasetTabs