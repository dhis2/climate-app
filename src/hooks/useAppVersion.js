import { useDataQuery, useConfig } from '@dhis2/app-runtime'
import { useCallback, useState, useEffect, useMemo } from 'react'

const APP_QUERY = {
    apps: {
        resource: 'apps',
    },
}

const getAppVersion = ({ installedApps, bundledApps, key }) => {
    // Use installed app if any
    const installed = installedApps?.find((app) => app.key === key)
    if (installed) {
        return installed.version
    }

    // Use bundled version otherwise
    const bundled = bundledApps?.find((app) => app.name === key)
    if (bundled) {
        return bundled.version
    }

    return null
}

const isVersionEqualOrHigher = (version, target) => {
    if (!version) {
        return false
    }
    const parse = (v) => v.split('-')[0].split('.').map(Number)
    const vParts = parse(version)
    const tParts = parse(target)

    for (let i = 0; i < 3; i++) {
        const vNum = vParts[i] || 0
        const tNum = tParts[i] || 0
        if (vNum > tNum) {
            return true
        }
        if (vNum < tNum) {
            return false
        }
    }

    return true
}

const useAppVersion = (key, targetVersion) => {
    const { baseUrl } = useConfig()
    const {
        data: installedApps,
        loading: installedLoading,
        error: installedError,
    } = useDataQuery(APP_QUERY)

    const [bundledApps, setBundledApps] = useState(null)
    const [bundledError, setBundledError] = useState(null)
    const [bundledLoading, setBundledLoading] = useState(true)

    const fetchBundledApps = useCallback(async () => {
        try {
            const url = new URL('dhis-web-apps/apps-bundle.json', `${baseUrl}/`)
            const response = await fetch(url.href, { credentials: 'include' })
            if (!response.ok) {
                throw new Error('Failed to fetch bundled apps JSON')
            }

            const json = await response.json()
            setBundledApps(json)
        } catch (e) {
            setBundledError(e)
        } finally {
            setBundledLoading(false)
        }
    }, [baseUrl])

    useEffect(() => {
        fetchBundledApps()
    }, [fetchBundledApps])

    const version = useMemo(
        () =>
            getAppVersion({
                installedApps: installedApps?.apps,
                bundledApps,
                key,
            }),
        [installedApps, bundledApps, key]
    )

    const meetsVersion = useMemo(
        () => isVersionEqualOrHigher(version, targetVersion),
        [version, targetVersion]
    )

    return {
        version,
        meetsVersion,
        loading: installedLoading || bundledLoading,
        error: installedError || bundledError,
    }
}

export default useAppVersion
