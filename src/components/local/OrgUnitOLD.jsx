import i18n from '@dhis2/d2-i18n'
import { useState, useEffect } from 'react'
import {
    Outlet,
    useLoaderData,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom'
import exploreStore from '../../store/exploreStore.js'
import OrgUnitType from './OrgUnitType.jsx'
import DataConnectorSelect from './DataConnectorSelect.jsx'
import DataConnectorDatasetTabs from './DataConnectorDatasetTabs.jsx'
import { fetchDataConnectorDatasets } from '../../utils/dataConnector.js'
import styles from './styles/OrgUnit.module.css'
import useAppSettings from '../../hooks/useAppSettings.js'
import localStore from '../../store/localStore.js'

const OrgUnit = () => {
    const orgUnit = useLoaderData()
    const { orgUnitId, serverId, datasetId, startTime, endTime } = useParams()
    const navigate = useNavigate()
    const { settings } = useAppSettings()
    const { setOrgUnit, monthlyPeriod } = localStore()

    const { datasets, setDatasets } = localStore()
    const [dataConnector, setDataConnector] = useState(undefined)

    useEffect(() => {
        if (serverId && datasetId && !startTime) {
            // url does not contain period info, redirect to monthly default
            navigate(`/local/${orgUnitId}/${serverId}/${datasetId}/monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}`)
        }
    }, [orgUnitId, serverId, datasetId, startTime, monthlyPeriod, navigate])

    useEffect(() => {
        setOrgUnit(orgUnit)
        return () => {
            setOrgUnit(null)
        }
    }, [orgUnit, setOrgUnit])

    useEffect(() => {
        if (!settings) return
        const { dataConnectors = [] } = settings
        const match = dataConnectors.find((m) => m.id == serverId)
        console.log('data connector', match)
        setDataConnector(match)
    }, [settings, serverId])

    useEffect(() => {
        if (dataConnector) {
            const serverUrl = dataConnector.url
            fetchDataConnectorDatasets({ host: serverUrl })
                .then(setDatasets)
                .catch(() => setDatasets([]))
        }
    }, [dataConnector])

    const handleServerChange = ({selected}) => {
        console.log('server change', selected)
        navigate(`/local/${orgUnitId}/${selected}`)
    }

    return (
        <div className={styles.container}>
            <div className={styles.orgUnit}>
                <h1>
                    {orgUnit.properties.name}{' '}
                    <OrgUnitType type={orgUnit?.geometry?.type} />
                </h1>

                {!orgUnit.geometry && (
                    <div className={styles.message}>
                        No geometry found
                    </div>
                )}

                <DataConnectorSelect
                    selected={serverId}
                    onChange={handleServerChange}
                />

                {dataConnector && (
                    <>
                        <p>{dataConnector.description}</p>
                        <DataConnectorDatasetTabs
                            datasets={datasets}
                        />
                    </>
                )}

                <Outlet />
                
            </div>
        </div>
    )
}

export default OrgUnit
