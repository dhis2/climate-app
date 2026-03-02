import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect, useMemo, useRef } from 'react'
import { toGeoJson } from '../utils/toGeoJson.js'
import useSystemInfo from './useSystemInfo.js'

export const GEOFEATURES_QUERY = {
    geoFeatures: {
        resource: 'geoFeatures',
        params: ({ orgUnitIds, keyAnalysisDisplayProperty, userId }) => ({
            ou: `ou:${orgUnitIds.join(';')}`,
            displayProperty: keyAnalysisDisplayProperty,
            _: userId,
        }),
    },
}

const DEFAULT_ORG_UNITS = []
const EMPTY_FEATURES = []

const useOrgUnits = ({ orgUnits = DEFAULT_ORG_UNITS, debounceDelay = 250 }) => {
    const [features, setFeatures] = useState(EMPTY_FEATURES)
    const [featuresLoading, setFeaturesLoading] = useState(false)
    const { system } = useSystemInfo()

    const userId = system?.currentUser?.id
    const keyAnalysisDisplayProperty =
        system?.currentUser?.settings?.keyAnalysisDisplayProperty

    const orgUnitIds = useMemo(
        () => orgUnits.map((item) => item.id),
        [orgUnits]
    )

    const { error, loading, refetch } = useDataQuery(GEOFEATURES_QUERY, {
        lazy: true,
    })
    const requestIdRef = useRef(0)
    const debounceTimeoutRef = useRef(null)

    useEffect(() => {
        // Clear any pending refetch
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        const performRefetch = () => {
            if (userId && keyAnalysisDisplayProperty && orgUnitIds.length > 0) {
                const requestId = requestIdRef.current + 1
                requestIdRef.current = requestId
                refetch({
                    orgUnitIds,
                    keyAnalysisDisplayProperty,
                    userId,
                })
                    .then((data) => {
                        if (!data || requestId !== requestIdRef.current) {
                            return
                        }
                        setFeatures(toGeoJson(data.geoFeatures))
                        setFeaturesLoading(false)
                    })
                    .catch(() => {
                        // Errors are surfaced via the data query error state.
                        setFeaturesLoading(false)
                    })
            } else {
                requestIdRef.current += 1
                setFeatures(EMPTY_FEATURES)
                setFeaturesLoading(false)
            }
        }

        // Set loading immediately on selection change
        if (userId && keyAnalysisDisplayProperty && orgUnitIds.length > 0) {
            setFeaturesLoading(true)
        } else {
            setFeaturesLoading(false)
        }

        // Debounce the refetch (0ms = no debounce, immediate request)
        debounceTimeoutRef.current = setTimeout(performRefetch, debounceDelay)

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [userId, keyAnalysisDisplayProperty, orgUnitIds, refetch, debounceDelay])

    return {
        features,
        featuresLoading,
        error,
        loading,
    }
}

export default useOrgUnits
