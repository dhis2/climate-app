import i18n from '@dhis2/d2-i18n'
import { dataProviders } from '../../data/providers.js'
import useAppSettings from '../../hooks/useAppSettings.js'
import useRoutesAPI from '../../hooks/useRoutesAPI.js'
import ChartSettings from './ChartSettings.jsx'
import DataProviderList from './DataProviderList.jsx'
import StartPageSelect from './StartPageSelect.jsx'
import styles from './styles/SettingsPage.module.css'
import TimeZoneSelect from './TimeZoneSelect.jsx'

const SettingsPage = () => {
    const { settings, changeSetting } = useAppSettings()

    const { routes } = useRoutesAPI()
    console.log('routes', routes)

    if (!settings) {
        return null
    }

    const { startPage, timeZone } = settings

    // convert routes list to a lookup dict
    const routesLookup = Object.fromEntries(
        routes.map((item) => [item.code, item])
    )

    // fill in data provider details based on route codes in routes api
    const dataProvidersUpdated = dataProviders.map((item) => ({
        ...item,
        ...(routesLookup[item.routeCode] || {}),
    }))
    console.log('data providers', dataProvidersUpdated)

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
            <DataProviderList dataProviders={dataProvidersUpdated} />
            <ChartSettings />
        </div>
    )
}

export default SettingsPage
