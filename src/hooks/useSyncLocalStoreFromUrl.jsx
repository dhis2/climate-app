import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useAppSettings from './useAppSettings'
import localStore from '../store/localStore' // adjust path to your zustand store
import { fetchDataConnectorDatasets } from '../utils/dataConnector'

export function useSyncLocalStoreFromUrl() {
    const { orgUnitId, serverId, datasetId, startTime, endTime } = useParams()
    const { settings, loading } = useAppSettings()
    const { dataConnector, setDataConnector, datasets, setDatasets } = localStore()
    const [ready, setReady] = useState(false)
    console.log('inside syncing element')

    useEffect(() => {
        const storeState = localStore.getState()
        console.log('inside syncing effect state', storeState)
        console.log('inside syncing effect settings', settings, loading)
        let stillWaiting = false

        if (!settings) {
            stillWaiting = true
        }

        if (serverId) {
            if (!storeState.dataConnector && settings?.dataConnectors && settings.dataConnectors.length > 0) {
                stillWaiting = true
                console.log('Syncing dataConnector', settings.dataConnectors, serverId, storeState.dataConnector)
                const match = settings.dataConnectors?.find(s => s.id === serverId)
                setDataConnector(match)
            }
            if (storeState.dataConnector && !storeState.datasets.length > 0) {
                stillWaiting = true
                console.log('Syncing datasets', serverId, storeState.dataConnector)
                fetchDataConnectorDatasets({ host: storeState.dataConnector.url })
                    .then(setDatasets)
                    .catch(() => setDatasets([]))
            }
        }
        console.log('stillWaiting', stillWaiting)
        setReady(!stillWaiting)
    }, [orgUnitId, serverId, dataConnector, datasets, settings])

    return { ready }
}
