import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import useAppSettings from '../../hooks/useAppSettings.js'
import ChartSettings from './ChartSettings.jsx'
import DataProviderList from './DataProviderList.jsx'
import StartPageSelect from './StartPageSelect.jsx'
import styles from './styles/SettingsPage.module.css'
import TimeZoneSelect from './TimeZoneSelect.jsx'

const SettingsPage = () => {
    const { settings, changeSetting } = useAppSettings()
    const { serverVersion } = useConfig() // VERSION_TOGGLE

    return (
        <div className={styles.container}>
            <h1>{i18n.t('App settings')}</h1>
            <p>
                {i18n.t(
                    'Changes made below will apply to all users of this app.'
                )}
            </p>
            {serverVersion.minor > 39 && <DataProviderList />}
            <h2>{i18n.t('General settings')}</h2>
            {settings && (
                <>
                    <StartPageSelect
                        startPage={settings.startPage}
                        onChange={changeSetting}
                    />
                    <TimeZoneSelect
                        timeZone={settings.timeZone}
                        onChange={changeSetting}
                    />
                </>
            )}
            <ChartSettings />
        </div>
    )
}

export default SettingsPage
