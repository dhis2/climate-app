import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useEffect, useRef, useState } from 'react'

const APP_NAMESPACE = 'CLIMATE_DATA'
const CONFIGS_KEY = 'importConfigs'
const resource = `userDataStore/${APP_NAMESPACE}/${CONFIGS_KEY}`

const generateId = () =>
    Math.random().toString(36).substring(2) + Date.now().toString(36)

const useImportConfigs = () => {
    const [loading, setLoading] = useState(true)
    const [configs, setConfigs] = useState([])
    const [error, setError] = useState()
    const engine = useDataEngine()
    const keyExists = useRef(false)

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

    const saveConfig = useCallback(
        ({ name, dataset, periodType, orgUnits, dataElement, lastImport }) => {
            const newConfig = {
                id: generateId(),
                name,
                createdAt: new Date().toISOString(),
                dataset,
                periodType,
                orgUnits,
                dataElement,
                lastImport,
            }
            const newConfigs = [...configs, newConfig]
            setConfigs(newConfigs)
            return persistConfigs(newConfigs)
        },
        [configs, persistConfigs]
    )

    const updateConfig = useCallback(
        (id, lastImport) => {
            const newConfigs = configs.map((c) =>
                c.id === id ? { ...c, lastImport } : c
            )
            setConfigs(newConfigs)
            return persistConfigs(newConfigs)
        },
        [configs, persistConfigs]
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

    return { configs, loading, error, saveConfig, updateConfig, deleteConfig }
}

export default useImportConfigs
