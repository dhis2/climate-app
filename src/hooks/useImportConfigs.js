import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useEffect, useRef, useState } from 'react'
import useSystemInfo from './useSystemInfo.js'

const APP_NAMESPACE = 'CLIMATE_DATA'
const CONFIGS_KEY = 'recurringImports'
const resource = `dataStore/${APP_NAMESPACE}/${CONFIGS_KEY}`

const generateId = () =>
    Math.random().toString(36).substring(2) + Date.now().toString(36)

const useImportConfigs = () => {
    const [loading, setLoading] = useState(true)
    const [configs, setConfigs] = useState([])
    const [error, setError] = useState()
    const engine = useDataEngine()
    const { system } = useSystemInfo()
    const keyExists = useRef(false)

    const currentUser = system?.currentUser

    const loadConfigs = useCallback(() => {
        setLoading(true)
        engine
            .query({ data: { resource } })
            .then(({ data }) => {
                keyExists.current = true
                setConfigs(data?.configs || [])
                setLoading(false)
            })
            .catch((err) => {
                if (err?.details?.httpStatusCode === 404) {
                    keyExists.current = false
                    setConfigs([])
                    setLoading(false)
                } else {
                    setError(err)
                    setLoading(false)
                }
            })
    }, [engine])

    const persistConfigs = useCallback(
        (newConfigs) => {
            const type = keyExists.current ? 'update' : 'create'
            return engine
                .mutate({ resource, type, data: { configs: newConfigs } })
                .then(() => {
                    keyExists.current = true
                })
                .catch(setError)
        },
        [engine]
    )

    const createConfig = useCallback(
        ({
            name,
            dataset,
            dataElement,
            orgUnits,
            featureCount,
            periodType,
            timeZone,
        }) => {
            const newConfig = {
                id: generateId(),
                name,
                // Store only the dataset id, never the live dataset object: it
                // carries functions (valueParser, reducers) that JSON drops,
                // which would silently import unconverted values on re-run.
                // The live dataset is re-hydrated by id at run time.
                datasetId: dataset?.id ?? null,
                datasetName: dataset?.name ?? null,
                dataElement,
                orgUnits,
                featureCount,
                periodType,
                timeZone: timeZone ?? null,
                dataUpdatedThrough: null,
                createdAt: new Date().toISOString(),
                createdBy: currentUser?.id ?? null,
                createdByName: currentUser?.name ?? null,
                lastRunAt: null,
                lastRunBy: null,
                lastRunByName: null,
                lastRunError: null,
            }
            const newConfigs = [...configs, newConfig]
            setConfigs(newConfigs)
            return persistConfigs(newConfigs).then(() => newConfig)
        },
        [configs, persistConfigs, currentUser]
    )

    const updateConfig = useCallback(
        (id, patch) => {
            const newConfigs = configs.map((c) =>
                c.id === id ? { ...c, ...patch } : c
            )
            setConfigs(newConfigs)
            return persistConfigs(newConfigs)
        },
        [configs, persistConfigs]
    )

    const recordRun = useCallback(
        (id, { dataUpdatedThrough, lastRunError = null }) => {
            const patch = {
                lastRunAt: new Date().toISOString(),
                lastRunBy: currentUser?.id ?? null,
                lastRunByName: currentUser?.name ?? null,
                lastRunError,
            }
            if (dataUpdatedThrough !== undefined) {
                patch.dataUpdatedThrough = dataUpdatedThrough
            }
            return updateConfig(id, patch)
        },
        [updateConfig, currentUser]
    )

    const renameConfig = useCallback(
        (id, name) => updateConfig(id, { name }),
        [updateConfig]
    )

    const deleteConfig = useCallback(
        (id) => {
            const newConfigs = configs.filter((c) => c.id !== id)
            setConfigs(newConfigs)
            return persistConfigs(newConfigs)
        },
        [configs, persistConfigs]
    )

    useEffect(() => {
        loadConfigs()
    }, [loadConfigs])

    return {
        configs,
        loading,
        error,
        currentUser,
        createConfig,
        recordRun,
        renameConfig,
        deleteConfig,
    }
}

export default useImportConfigs
