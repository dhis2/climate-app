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
import useRoutesAPI from '../hooks/useRoutesAPI.js'

export const PROVIDER_GEE = 'gee'
export const PROVIDER_ENACTS = 'enacts'
const enactsRouteCode = PROVIDER_ENACTS

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

const DataSourcesProvider = ({ children }) => {
    const [hasGeeToken, setHasGeeToken] = useState(null)
    const tokenPromise = useEarthEngineToken()

    const {
        routes,
        loading: routesLoading,
        error: routesError,
    } = useRoutesAPI()

    const eroute =
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

    const data = {
        [PROVIDER_GEE]: {
            ...geeProvider,
            enabled: hasGeeToken,
            loading: hasGeeToken === null,
        },
        [PROVIDER_ENACTS]: {
            ...enactsProvider,
            enabled: enactsInfo?.enabled || false,
            loading: routesLoading || enactsInfoLoading,
            route: enactsRoute,
            info: enactsInfo,
            error: enactsInfoError,
        },
    }

    console.log('jj DataSourcesProvider data:', data)

    if (!routesLoading && !routesError && !eroute) {
        console.warn(
            `Could not find a route with the code "${enactsRouteCode}"`
        )
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
