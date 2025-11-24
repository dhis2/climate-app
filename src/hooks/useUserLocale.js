import { useDataQuery } from '@dhis2/app-runtime'

const USER_LOCALE_QUERY = {
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale'],
        },
    },
}

const useUserLocale = () => {
    const { loading, error, data } = useDataQuery(USER_LOCALE_QUERY)

    const locale = data?.userSettings?.keyUiLocale ?? 'en'

    return {
        locale,
        loading,
        error,
    }
}

export default useUserLocale
