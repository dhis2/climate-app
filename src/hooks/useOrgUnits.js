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

const useOrgUnits = ({ orgUnits = DEFAULT_ORG_UNITS }) => {
    const [features, setFeatures] = useState(EMPTY_FEATURES)
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
        onComplete: (data) => setFeatures(toGeoJson(data.geoFeatures)),
    })

    useEffect(() => {
        if (userId && keyAnalysisDisplayProperty && orgUnitIds.length > 0) {
            refetch({
                orgUnitIds,
                keyAnalysisDisplayProperty,
                userId,
            })
        } else {
            setFeatures(EMPTY_FEATURES)
        }
    }, [userId, keyAnalysisDisplayProperty, orgUnitIds, refetch])

    return {
        features,
        error,
        loading,
    }
}

export default useOrgUnits
