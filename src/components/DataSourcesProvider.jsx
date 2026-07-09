import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from 'react'
import useEarthEngineToken from '../hooks/useEarthEngineToken.js'
import useEnactsInfo from '../hooks/useEnactsInfo.js'
import useOcsInfo from '../hooks/useOcsInfo.js'
import useRoutesAPI from '../hooks/useRoutesAPI.js'

export const PROVIDER_GEE = 'gee'
export const PROVIDER_ENACTS = 'enacts'
export const PROVIDER_OCS = 'ocs'
const enactsRouteCode = PROVIDER_ENACTS
const ocsRouteCode = PROVIDER_OCS

const CachedDataQueryCtx = createContext({})

export const geeProvider = {
    id: PROVIDER_GEE,
    name: 'Google Earth Engine',
    nameShort: 'Earth Engine',
}

export const enactsProvider = {
    id: PROVIDER_ENACTS,
    name: 'ENACTS Data Sharing Tool (DST)',
    nameShort: 'ENACTS',
}

export const ocsProvider = {
    id: PROVIDER_OCS,
    name: 'Open Climate Service (OCS)',
    nameShort: 'OCS',
}

const DataSourcesProvider = ({ children }) => {
    const [hasGeeToken, setHasGeeToken] = useState(null)
    const tokenPromise = useEarthEngineToken()
    const { serverVersion } = useConfig()
    const isEnactsSupported = serverVersion.minor >= 41

    const {
        routes,
        loading: routesLoading,
        error: routesError,
    } = useRoutesAPI()

    const eroute =
        isEnactsSupported &&
        !routesLoading &&
        !routesError &&
        routes?.find((route) => route.code == enactsRouteCode)

    const enactsRoute = useMemo(() => eroute, [eroute])

    const {
        data: eInfo,
        loading: enactsInfoLoading,
        error: enactsInfoError,
    } = useEnactsInfo(enactsRoute)

    const enactsInfo = useMemo(() => eInfo, [eInfo])

    const oroute =
        !routesLoading &&
        !routesError &&
        routes?.find((route) => route.code == ocsRouteCode)

    const ocsRoute = useMemo(() => oroute, [oroute])

    const {
        data: oInfo,
        loading: ocsInfoLoading,
        error: ocsInfoError,
    } = useOcsInfo(ocsRoute)

    const ocsInfo = useMemo(() => oInfo, [oInfo])

    useEffect(() => {
        if (hasGeeToken !== null) {
            return
        }
        tokenPromise
            .then(() => {
                setHasGeeToken(true)
            })
            .catch(() => {
                setHasGeeToken(false)
            })
    }, [tokenPromise, hasGeeToken])

    const data = useMemo(
        () => ({
            [PROVIDER_GEE]: {
                ...geeProvider,
                enabled: hasGeeToken,
                loading: hasGeeToken === null,
            },
            [PROVIDER_ENACTS]: {
                ...enactsProvider,
                supported: isEnactsSupported,
                enabled: enactsInfo?.enabled || false,
                loading: routesLoading || enactsInfoLoading,
                route: enactsRoute,
                info: enactsInfo,
                error: enactsInfoError,
            },
            [PROVIDER_OCS]: {
                ...ocsProvider,
                enabled: ocsInfo?.status === 'healthy',
                loading: routesLoading || ocsInfoLoading,
                route: ocsRoute,
                info: ocsInfo,
                error: ocsInfoError,
            },
        }),
        [
            hasGeeToken,
            isEnactsSupported,
            enactsInfo,
            enactsInfoError,
            routesLoading,
            enactsInfoLoading,
            enactsRoute,
            ocsInfo,
            ocsInfoError,
            ocsInfoLoading,
            ocsRoute,
        ]
    )

    if (!routesLoading && !routesError && !eroute) {
        console.warn(
            `Could not find a route with the code "${enactsRouteCode}"`
        )
    }

    if (!routesLoading && !routesError && !oroute) {
        console.warn(`Could not find a route with the code "${ocsRouteCode}"`)
    }

    return (
        <CachedDataQueryCtx.Provider value={data}>
            {children}
        </CachedDataQueryCtx.Provider>
    )
}

DataSourcesProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

const useDataSources = () => useContext(CachedDataQueryCtx)

export { DataSourcesProvider, useDataSources }
