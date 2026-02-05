import { useDataQuery } from '@dhis2/app-runtime'
import { useState } from 'react'
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

    const orgUnitIds = orgUnits.map((item) => item.id)

    const { error, loading } = useDataQuery(GEOFEATURES_QUERY, {
        lazy: !userId || !keyAnalysisDisplayProperty,
        variables: {
            orgUnitIds,
            keyAnalysisDisplayProperty,
            userId,
        },
        onComplete: (data) => {
            setCount(data.geoFeatures.length)
            if (!skipFeatures) {
                setFeatures(toGeoJson(data.geoFeatures))
            }
        },
    })

    return {
        features,
        count,
        error,
        loading,
    }
}

export default useOrgUnits
