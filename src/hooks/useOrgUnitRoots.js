import { useDataQuery } from '@dhis2/app-runtime'

// Fetches the root org units associated with the current user with fallback to data capture org units
const ORG_UNIT_ROOTS_QUERY = {
    roots: {
        resource: 'organisationUnits',
        params: () => ({
            fields: ['id', 'displayName~rename(name)', 'path'],
            userDataViewFallback: true,
        }),
    },
}

const useOrgUnitRoots = () => {
    const { loading, error, data } = useDataQuery(ORG_UNIT_ROOTS_QUERY)

    return {
        roots: data?.roots?.organisationUnits,
        error,
        loading,
    }
}

export default useOrgUnitRoots
