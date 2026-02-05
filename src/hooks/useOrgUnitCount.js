import { useDataQuery } from '@dhis2/app-runtime'
import { useState, useEffect, useMemo } from 'react'
import { GEOFEATURES_QUERY } from './useOrgUnits.js'
import useSystemInfo from './useSystemInfo.js'

const useOrgUnitCount = (orgUnits) => {
    const [orgUnitCount, setOrgUnitCount] = useState(0)
    const { system } = useSystemInfo()

    const userId = system?.currentUser?.id
    const keyAnalysisDisplayProperty =
        system?.currentUser?.settings?.keyAnalysisDisplayProperty

    // Extract IDs from orgUnits array of objects
    const orgUnitIds = useMemo(
        () => orgUnits?.map((item) => item.id) || [],
        [orgUnits]
    )

    const { refetch } = useDataQuery(GEOFEATURES_QUERY, {
        lazy: true,
        variables: { orgUnitIds, keyAnalysisDisplayProperty, userId },
        onComplete: ({ geoFeatures }) => setOrgUnitCount(geoFeatures.length),
    })

    useEffect(() => {
        if (orgUnitIds.length > 0 && userId && keyAnalysisDisplayProperty) {
            refetch({ orgUnitIds, keyAnalysisDisplayProperty, userId })
        } else {
            // Reset count when orgUnitIds is empty or undefined
            setOrgUnitCount(0)
        }
    }, [orgUnitIds, userId, keyAnalysisDisplayProperty, refetch])

    return orgUnitCount
}

export default useOrgUnitCount
