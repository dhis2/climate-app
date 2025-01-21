import i18n from '@dhis2/d2-i18n'
import StartPageSelect from './StartPageSelect'
import TimeZoneSelect from './TimeZoneSelect'
import ChartSettings from './ChartSettings'
import useAppSettings from '../../hooks/useAppSettings'
import styles from './styles/SettingsPage.module.css'

const SettingsPage = () => {
    const { settings, changeSetting } = useAppSettings()

    if (!settings) {
        return null
    }

    const { startPage, timeZone } = settings

    return (
        <div className={styles.container}>
            <h1>{i18n.t('App settings')}</h1>
            <p>
                {i18n.t(
                    'Changes made below will apply to all users of this app.'
                )}
            </p>
            <StartPageSelect startPage={startPage} onChange={changeSetting} />
            <TimeZoneSelect timeZone={timeZone} onChange={changeSetting} />
            <ChartSettings />
        </div>
    )
}

export default SettingsPage
