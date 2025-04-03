import i18n from '@dhis2/d2-i18n'
import GEETokenCheck from './shared/GEETokenCheck.jsx'
import styles from './styles/AboutPage.module.css'

// TODO: How to combine links and i18n.t?
const AboutPage = () => (
    <div className={styles.container}>
        <h1>{i18n.t('About this app')}</h1>
        <GEETokenCheck />
        <p>
            {i18n.t(
                'This pilot app is part of the ongoing “DHIS2 for Climate“ project. It will get frequent updates, so please make sure you have the latest version from the DHIS2 App Hub. The app is developed by the University of Oslo, but it is not a DHIS2 core app. Useful parts of this app might be incorporated into the DHIS2 core in the future, based on your feedback.'
            )}
        </p>
        <p>
            {i18n.t(
                'The app allows you to explore and import temperature, precipitation, humidity and heat stress data in DHIS2. The main data source is ERA5-Land, which is considered the most accurate and complete global climate dataset available. The video below shows you how this dataset was created by combining weather observations with a weather model (climate reanalysis).'
            )}
        </p>
        <iframe
            src="https://www.youtube-nocookie.com/embed/FAGobvUGl24?si=nBJeVx1_BPM4X5vF&rel=0"
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        ></iframe>
        <p>
            <a
                href="https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land"
                target="_blank"
                rel="noreferrer"
            >
                {i18n.t(
                    'Read about ERA5-Land on Copernicus Climate Data Store'
                )}
            </a>
        </p>
        <p>
            {i18n.t(
                'In additon to ERA5-Land, precipitation data can also be imported from the CHIRPS dataset. For heat stress we use data from ERA5-HEAT.'
            )}
        </p>
        <p>
            <a
                href="https://www.chc.ucsb.edu/data/chirps"
                target="_blank"
                rel="noreferrer"
            >
                {i18n.t('Read about CHIRPS on Climate Hazards Center')}
            </a>
        </p>
        <p>
            <a
                href="https://cds.climate.copernicus.eu/datasets/derived-utci-historical"
                target="_blank"
                rel="noreferrer"
            >
                {i18n.t(
                    'Read about ERA5-HEAT on Copernicus Climate Data Store'
                )}
            </a>
        </p>
        <p>
            {i18n.t(
                'If you just want to look at weather and climate data for your organisation units, click on “Explore data” in the left menu. No configuration is needed.'
            )}
        </p>
        <p>
            {i18n.t(
                'We recommend importing data into DHIS2 data elements. This will allow you to combine weather and climate data with your health data across all DHIS2 analytics apps. You need to configure your DHIS2 instance before you can import data. See our guide by clicking on “Setup guide”.'
            )}
        </p>
        <p>
            {i18n.t(
                'After the configuration is done, you can import temperature and precipitation data under “Import data”.'
            )}
        </p>
        <p>
            {i18n.t(
                'After the data is imported, you should generate the analytics tables in the Data Administration app. This will allow you to see the data in the DHIS2 analytics apps.'
            )}
        </p>
        <h2>{i18n.t('How the data is calculated')}</h2>
        <p>
            {i18n.t(
                'The data is calculated for your organsation units on Google Earth Engine. Pleace check the resolution of the data. If you select a health facility we use the value where the facility is located. If you select a district we automatically aggregate the values within that district. If two org units are close to each other (within the resolution), they will have the same data values.'
            )}
        </p>
    </div>
)

export default AboutPage
