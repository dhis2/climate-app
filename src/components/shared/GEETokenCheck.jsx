import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { useState, useEffect } from 'react'
import useEarthEngineToken from '../../hooks/useEarthEngineToken.js'
import styles from './styles/GEETokenCheck.module.css'

const GEETokenCheck = () => {
    const [hasToken, setHasToken] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const tokenPromise = useEarthEngineToken()

    useEffect(() => {
        tokenPromise
            .then((token) => setHasToken(!!token))
            .catch(() => setHasToken(false))
    }, [tokenPromise])

    useEffect(() => {
        if (hasToken !== undefined) {
            setIsLoading(false)
        }
    }, [hasToken])

    return !isLoading && hasToken !== true ? (
        <div className={styles.container}>
            <NoticeBox warning>
                {i18n.t(
                    'You need access to Google Earth Engine to explore data.'
                )}{' '}
                <a href="https://docs.dhis2.org/en/topics/tutorials/google-earth-engine-sign-up.html">
                    {i18n.t('How to get access?')}
                </a>
            </NoticeBox>
        </div>
    ) : null
}

export default GEETokenCheck
