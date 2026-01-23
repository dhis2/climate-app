import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import styles from './styles/GEETokenWarning.module.css'

export const GEETokenWarning = () => {
    return (
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
    )
}
