// import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { dataProviders, PROVIDER_ENACTS } from '../data/providers.js'
import useEarthEngineToken from '../hooks/useEarthEngineToken.js'
import useEnactsInfo from '../hooks/useEnactsInfo.js'
import useRoutesAPI from '../hooks/useRoutesAPI.js'

const dataProvider = dataProviders.find((item) => item.id == PROVIDER_ENACTS)
const routeCode = dataProvider['routeCode']

const CachedDataQueryCtx = createContext({})

// TODO = use version toggle for enacts
// TODO = return list of providers and their status and token?
// TODO - useMemo instead of useState/useEffect where possible

const DataSourcesProvider = ({ children }) => {
    const [geeToken, setGeeToken] = useState(null)
    const [enactsInfo, setEnactsInfo] = useState(false)
    const [enactsRoute, setEnactsRoute] = useState(null)
    const tokenPromise = useEarthEngineToken()

    const {
        routes,
        loading: routesLoading,
        error: routesError,
    } = useRoutesAPI()

    const eroute =
        !routesLoading &&
        !routesError &&
        routes?.find((route) => route.code == routeCode)

    if (!routesLoading && !routesError && !eroute) {
        console.warn(`Could not find a route with the code "${routeCode}"`)
    }

    useEffect(() => {
        setEnactsRoute(eroute)
    }, [eroute])

    const {
        data: eInfo,
        loading: enactsInfoLoading,
        // error: enactsInfoError,
    } = useEnactsInfo(enactsRoute)

    useEffect(() => {
        if (geeToken === false || geeToken?.access_token) {
            return
        }
        tokenPromise
            .then((token) => {
                setGeeToken(token)
            })
            .catch(() => {
                setGeeToken(false)
            })
    }, [tokenPromise, geeToken])

    useEffect(() => {
        if (eInfo) {
            setEnactsInfo(eInfo)
        }
    }, [eInfo])

    // if (error) {
    //     const fallbackMsg = i18n.t('This app could not retrieve required data.')

    //     return (
    //         <NoticeBox error title={i18n.t('Network error')}>
    //             {error.message || fallbackMsg}
    //         </NoticeBox>
    //     )
    // }

    const data = {
        geeToken,
        enactsInfo,
        enactsRoute,
        loading: geeToken === null || routesLoading || enactsInfoLoading,
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
