import i18n from '@dhis2/d2-i18n'
import styles from './styles/ExplorePage.module.css'

const ExplorePage = () => (
    <div className={styles.container}>
        <h1>{i18n.t('Explore weather and climate data')}</h1>
        <p>{i18n.t('Select an organisation unit in the left panel')}</p>
        <img src="images/explore.png" alt="Explore data screenshots" />
    </div>
)

export default ExplorePage
