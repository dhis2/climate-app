import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import useAppSettings from './useAppSettings'
import localStore from '../store/localStore' // adjust path to your zustand store
import { fetchDataConnectorDatasets } from '../utils/dataConnector'

export function useSyncLocalStoreFromUrl() {
    const { orgUnitId, serverId, datasetId, startTime, endTime } = useParams()
    const { settings, loading } = useAppSettings()
    const { dataConnector, setDataConnector, datasets, setDatasets, periodType, setPeriodType, setMonthlyPeriod, setDailyPeriod } = localStore()
    const [ready, setReady] = useState(false)
    const path = useLocation().pathname
    console.log('inside syncing element at', path)

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
                setDatasets([])
            }
            if (storeState.dataConnector && !storeState.datasets.length > 0) {
                stillWaiting = true
                console.log('Syncing datasets', serverId, storeState.dataConnector)
                fetchDataConnectorDatasets({ host: storeState.dataConnector.url })
                    .then(setDatasets)
                    .catch(() => setDatasets([]))
            }
        }

        // TODO: hacky, and should use period type constants
        // also period type should probably be made a url param 
        if (path.includes('/monthly/')) {
            setPeriodType('MONTHLY')
        } else if (path.includes('/daily/')) {
            setPeriodType('DAILY')
        }

        if (startTime && endTime) {
            if (localStore.getState().periodType == 'MONTHLY') {
                setMonthlyPeriod({startTime, endTime})
            } else if (localStore.getState().periodType == 'DAILY') {
                setDailyPeriod({startTime, endTime})
            }
        }
        
        console.log('stillWaiting?', stillWaiting)
        setReady(!stillWaiting)

    }, [path, orgUnitId, serverId, dataConnector, datasets, startTime, endTime, settings])

    return { ready }
}
