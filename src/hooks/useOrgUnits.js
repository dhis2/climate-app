import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect, useMemo } from 'react'
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

const useOrgUnits = ({
    orgUnits = DEFAULT_ORG_UNITS,
    skipToGeojson = false,
}) => {
    const [features, setFeatures] = useState(EMPTY_FEATURES)
    const [count, setCount] = useState(EMPTY_FEATURES.length)
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
        onComplete: (data) => {
            setCount(data.geoFeatures.length)
            !skipToGeojson && setFeatures(toGeoJson(data.geoFeatures))
        },
    })

    useEffect(() => {
        if (userId && keyAnalysisDisplayProperty && orgUnitIds.length > 0) {
            refetch({
                orgUnitIds,
                keyAnalysisDisplayProperty,
                userId,
            })
        } else {
            setCount(EMPTY_FEATURES.length)
            setFeatures(EMPTY_FEATURES)
        }
    }, [userId, keyAnalysisDisplayProperty, orgUnitIds, refetch, skipToGeojson])

    return {
        features,
        count,
        error,
        loading,
    }
}

export default useOrgUnits
