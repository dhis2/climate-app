import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import styles from './styles/PeriodWarning.module.css'

const islimitedData = (period) => {
    const startYear = new Date(period.startTime).getFullYear()
    const endYear = new Date(period.endTime).getFullYear()

    return startYear >= 2024 || endYear >= 2024
}

const PeriodWarning = ({ period }) => {
    return islimitedData(period) ? (
        <div className={styles.container}>
            {i18n.t(
                'For a temporary period there is limited data available for 2024. This is due to modernization work impacting the Copernicus Climate Data Store (CDS) where the data originates.'
            )}{' '}
            <a
                href="https://forum.ecmwf.int/t/a-new-cds-soon-to-be-launched-expect-some-disruptions/1607"
                target="_blank"
                rel="noreferrer"
            >
                {i18n.t('Read more on the CDS user forum')}
            </a>
        </div>
    ) : null
}
PeriodWarning.propTypes = {
    period: PropTypes.object,
}

export default PeriodWarning
