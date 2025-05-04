import i18n from '@dhis2/d2-i18n'
import styles from './styles/LocalPage.module.css'

const LocalPage = () => (
    <div className={styles.container}>
        <h1>{i18n.t('Local weather and climate data')}</h1>
        <p>{i18n.t('Select an organisation unit in the left panel')}</p>
        <img src="images/local.png" alt="Local data screenshots" style={{maxHeight: '75vh'}} />
    </div>
)

export default LocalPage
