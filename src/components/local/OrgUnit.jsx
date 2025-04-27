import i18n from '@dhis2/d2-i18n'
import { useState, useEffect } from 'react'
import { useLoaderData, Outlet, useParams, useNavigate } from 'react-router-dom'
import useAppSettings from '../../hooks/useAppSettings'
import styles from './styles/OrgUnit.module.css'
import OrgUnitType from './OrgUnitType'
import DataConnectorSelect from './DataConnectorSelect'
import localStore from '../../store/localStore'
import { fetchDataConnectorDatasets } from '../../utils/dataConnector'
import { useSyncLocalStoreFromUrl } from '../../hooks/useSyncLocalStoreFromUrl'
import DataLoader from '../shared/DataLoader'

const OrgUnit = () => {
    const orgUnit = useLoaderData()
    const { orgUnitId, serverId } = useParams()
    const navigate = useNavigate()
    const { settings } = useAppSettings()

    const { ready } = useSyncLocalStoreFromUrl()
    const { dataConnector, setOrgUnit } = localStore()

    useEffect(() => {
        setOrgUnit(orgUnit)
    }, [orgUnit, setOrgUnit])

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

    // wait until url syncing and orgunit loading is done
    if (!ready | !orgUnit) return (
        <div style={{maxWidth: '800px'}}>
            <DataLoader label="Loading page..."/>
        </div>
    )

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
                    {dataConnector && <p style={{ margin: '20px 10px'}}>{dataConnector.description}</p>}
                </div>

                <Outlet />

            </div>
        </div>
    )
}

export default OrgUnit
