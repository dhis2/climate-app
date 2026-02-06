import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect, useMemo } from 'react'
import { toGeoJson } from '../utils/toGeoJson.js'
import useSystemInfo from './useSystemInfo.js'

export const GEOFEATURES_QUERY = {
    geoFeatures: {
        resource: 'geoFeatures',
        params: ({
            orgUnitIds,
            keyAnalysisDisplayProperty,
            includeGroupSets,
            coordinateField,
            userId,
        }) => ({
            ou: `ou:${orgUnitIds.join(';')}`,
            displayProperty: keyAnalysisDisplayProperty,
            includeGroupSets,
            coordinateField,
            _: userId,
        }),
    },
}

const DEFAULT_ORG_UNITS = []

const useOrgUnits = ({
    orgUnits = DEFAULT_ORG_UNITS,
    skipFeatures = false,
}) => {
    const [features, setFeatures] = useState()
    const [count, setCount] = useState(0)
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
            if (!skipFeatures) {
                setFeatures(toGeoJson(data.geoFeatures))
            }
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
            // Reset when conditions aren't met
            setCount(0)
            setFeatures(undefined)
        }
    }, [userId, keyAnalysisDisplayProperty, orgUnitIds, refetch, skipFeatures])

    return {
        features,
        count,
        error,
        loading,
    }
}

export default useOrgUnits
