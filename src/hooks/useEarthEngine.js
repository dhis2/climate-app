import ee from '../lib/earthengine.js'
import useEarthEngineToken from './useEarthEngineToken.js'

const eePromise = (tokenPromise) =>
    new Promise((resolve, reject) => {
        if (ee.data.getAuthToken()) {
            ee.initialize(null, null, () => resolve(ee), reject)
        } else {
            tokenPromise
                .then((token) => {
                    const { token_type, access_token, client_id, expires_in } =
                        token
                    const extraScopes = null
                    const updateAuthLibrary = false

                    ee.data.setAuthToken(
                        client_id,
                        token_type,
                        access_token,
                        expires_in,
                        extraScopes,
                        () =>
                            ee.initialize(
                                null,
                                null,
                                () => resolve(ee),
                                reject
                            ),
                        updateAuthLibrary
                    )

                    ee.data.setAuthTokenRefresher(async (authArgs, callback) =>
                        callback({
                            ...(await tokenPromise),
                            state: authArgs.scope,
                        })
                    )
                })
                .catch(reject)
        }
    })

let eeInstance

const useEarthEngine = () => {
    const tokenPromise = useEarthEngineToken()

    if (!eeInstance) {
        eeInstance = eePromise(tokenPromise)
    }

    return eeInstance
}

export default useEarthEngine
