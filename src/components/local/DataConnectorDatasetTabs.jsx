import i18n from '@dhis2/d2-i18n'
import { TabBar, Tab } from '@dhis2/ui'
import { useState, useEffect, Outlet } from 'react'
import { fetchDataConnectorDatasets } from '../../utils/dataConnector'
import styles from './styles/DataConnectorTabs.module.css'
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom'
import localStore from '../../store/localStore'

const DataConnectorDatasetTabs = ({ datasets }) => {
    const { orgUnit } = localStore()
    const { serverId, datasetId, startTime } = useParams() // <- use this as selected
    const curPath = useLocation().pathname
    const navigate = useNavigate()
    console.log('datasetId', datasetId)

    const handleChange = (tabValue) => {
        if (!curPath.includes(`/${tabValue}/`) | !curPath.endsWith(`/${tabValue}`)) {
            const parts = curPath.split('/')
            parts[parts.length-4] = tabValue
            const newPath = parts.join('/')
            console.log(`Navigating from ${curPath} to ${newPath}`)
            navigate(newPath)
        }
    }

    // Set default dataset
    useEffect(() => {
        if (!datasetId && datasets?.length>0) {
            console.log('defaulting to first available dataset', datasets)
            navigate(`${datasets[0].id}`)
        }
    }, [datasetId, datasets, navigate])


    return (
        <TabBar selected={datasetId} fixed scrollable>
            {datasets.map((d) => (
                <Tab
                    key={d.id}
                    value={d.id}
                    selected={d.id == datasetId}
                    onClick={() => handleChange(d.id)}
                >
                    {d.shortName}
                </Tab>
            ))}
        </TabBar>
    )
}

export default DataConnectorDatasetTabs