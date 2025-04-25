import i18n from '@dhis2/d2-i18n'
import { useState, useEffect } from 'react'
import { useLoaderData, Outlet, useParams, useNavigate } from 'react-router-dom'
import useAppSettings from '../../hooks/useAppSettings'
import styles from './styles/OrgUnit.module.css'
import OrgUnitType from './OrgUnitType'
import DataConnectorSelect from './DataConnectorSelect'
import localStore from '../../store/localStore'
import { fetchDataConnectorDatasets } from '../../utils/dataConnector'

const OrgUnit = () => {
    const orgUnit = useLoaderData()
    const { orgUnitId, serverId } = useParams()
    const navigate = useNavigate()
    const { settings } = useAppSettings()
    const { dataConnector, setDataConnector, setDatasets } = localStore()

    useEffect(() => {
        if (!settings) return
        const match = settings.dataConnectors?.find(d => d.id === serverId)
        setDataConnector(match)
    }, [settings, serverId])

    useEffect(() => {
        if (dataConnector) {
            fetchDataConnectorDatasets({ host: dataConnector.url })
                .then(setDatasets)
                .catch(() => setDatasets([]))
        }
    }, [dataConnector, setDatasets])

    const handleServerChange = ({ selected }) => {
        console.log('handling server change', selected)
        navigate(`/local/${orgUnitId}/${selected}`)
    }

    // redirect to first available server if not given
    useEffect(() => {
        if (!serverId && settings) {
            if (!settings) return
            const { dataConnectors = [] } = settings
            console.log('defaulting to first available data connector', dataConnectors)
            if (dataConnectors) {
                handleServerChange({selected: dataConnectors[0].id})
            }
        }
    }, [serverId, settings])

    return (
        <div className={styles.container}>
            <div className={styles.orgUnit}>
                <h1>
                    {orgUnit.properties.name}{' '}
                    <OrgUnitType type={orgUnit?.geometry?.type} />
                </h1>

                {!orgUnit.geometry && (
                    <div className={styles.message}>No geometry found</div>
                )}

                <div className={styles.orgUnit}>
                    <DataConnectorSelect selected={serverId} onChange={handleServerChange} />
                    {!dataConnector && <p>{i18n.t('Please select a data server to continue.')}</p>}
                    {dataConnector && <p>{dataConnector.description}</p>}
                </div>

                <Outlet />

            </div>
        </div>
    )
}

export default OrgUnit
