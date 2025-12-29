import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { useState, useEffect } from 'react'
import { useDataSources } from '../DataSourcesProvider.jsx'
import styles from './styles/GEETokenCheck.module.css'

export const GEETokenCheck = () => {
    const [isLoading, setIsLoading] = useState(true)
    const { gee } = useDataSources()
    const hasGeeToken = gee.enabled

    useEffect(() => {
        if (!hasGeeToken) {
            setIsLoading(false)
        }
    }, [hasGeeToken])

    return !isLoading && !hasGeeToken ? (
        <div className={styles.container}>
            <NoticeBox warning>
                {i18n.t(
                    'You need access to Google Earth Engine to explore this data.'
                )}{' '}
                <a href="https://docs.dhis2.org/en/topics/tutorials/google-earth-engine-sign-up.html">
                    {i18n.t('How to get access?')}
                </a>
            </NoticeBox>
        </div>
    ) : null
}
