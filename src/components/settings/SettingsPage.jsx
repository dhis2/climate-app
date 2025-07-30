import i18n from '@dhis2/d2-i18n'
import useAppSettings from '../../hooks/useAppSettings.js'
import ChartSettings from './ChartSettings.jsx'
import StartPageSelect from './StartPageSelect.jsx'
import styles from './styles/SettingsPage.module.css'
import TimeZoneSelect from './TimeZoneSelect.jsx'
import DataProviderList from './DataProviderList.jsx'
import useRoutesAPI from '../../hooks/useRoutesAPI.js'

const SettingsPage = () => {
    const { settings, changeSetting } = useAppSettings()
    
    const { routes, routesLoading, routesError } = useRoutesAPI()
    console.log('routes', routes)

    if (!settings) {
        return null
    }

    const { startPage, timeZone } = settings

    // define list of data provider route codes that can be registered
    let dataProviders = [
        {routeCode: 'iri-enacts', name: 'IRI ENACTS API'},
        //{routeCode: 'example-code', name: 'Dummy Route'}
    ]

    // convert routes list to a lookup dict
    const routesLookup = Object.fromEntries(routes.map(item => [item.code, item]))
    
    // fill in data provider details based on route codes in routes api
    dataProviders = dataProviders.map(item => ({
        ...item,
        ...(routesLookup[item.routeCode] || {})
    }))
    console.log('data providers', dataProviders)

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
            <DataProviderList dataProviders={dataProviders} />
            <ChartSettings />
        </div>
    )
}

export default SettingsPage
