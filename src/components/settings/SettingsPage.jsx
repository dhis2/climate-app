import i18n from '@dhis2/d2-i18n'
import useAppSettings from '../../hooks/useAppSettings.js'
import ChartSettings from './ChartSettings.jsx'
import StartPageSelect from './StartPageSelect.jsx'
import styles from './styles/SettingsPage.module.css'
import TimeZoneSelect from './TimeZoneSelect.jsx'

const SettingsPage = () => {
    const { settings, changeSetting } = useAppSettings()

    if (!settings) {
        return null
    }

    const { startPage, timeZone } = settings

    // fill in data provider details based on route codes in routes api
    return (
        <div className={styles.container}>
            <h1>{i18n.t('App settings')}</h1>
            <p>
                {i18n.t(
                    'Changes made below will apply to all users of this app.'
                )}
            </p>
            <h2>{i18n.t('General settings')}</h2>
            <StartPageSelect startPage={startPage} onChange={changeSetting} />
            <TimeZoneSelect timeZone={timeZone} onChange={changeSetting} />
            <ChartSettings />
        </div>
    )
}

export default SettingsPage
