import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import styles from './styles/ImportResponse.module.css'

const ImportResponse = ({ importCount, chunkCount, splitCount }) => {
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
                {i18n.t('Ignored (already exists): {{ignored}}', {
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
            {chunkCount !== undefined && <div>{`Chunks: ${chunkCount}`}</div>}
            {splitCount !== undefined && <div>{`Splits: ${splitCount}`}</div>}
        </div>
    )
}

ImportResponse.propTypes = {
    importCount: PropTypes.object.isRequired,
    chunkCount: PropTypes.number,
    splitCount: PropTypes.number,
}

export default ImportResponse
