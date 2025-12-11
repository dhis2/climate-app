import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import styles from './styles/ImportResponse.module.css'

const ImportResponse = ({ importCount }) => {
    const { imported, updated, ignored, missing } = importCount
    return (
        <div className={styles.container}>
            <div className={styles.title}>{i18n.t('Data is imported')}</div>
            <div>
                {i18n.t('Imported: {{imported}}', {
                    imported,
                    nsSeparator: ';',
                })}
            </div>
            <div>
                {i18n.t('Updated: {{updated}}', {
                    updated,
                    nsSeparator: ';',
                })}
            </div>
            <div>
                {i18n.t('Ignored: {{ignored}}', {
                    ignored,
                    nsSeparator: ';',
                })}
            </div>
            <div>
                {i18n.t('Missing: {{missing}}', {
                    missing,
                    nsSeparator: ';',
                })}
            </div>
        </div>
    )
}

ImportResponse.propTypes = {
    importCount: PropTypes.object.isRequired,
}

export default ImportResponse
