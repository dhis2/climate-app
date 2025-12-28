import { useDataEngine } from '@dhis2/app-runtime'

const tokenQuery = {
    token: {
        resource: 'tokens/google',
    },
}

const useEarthEngineToken = () => {
    const engine = useDataEngine()

    return engine
        .query(tokenQuery)
        .then((data) => ({ ...data.token, token_type: 'Bearer' }))
}

export default useEarthEngineToken
