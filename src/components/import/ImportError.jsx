import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import ImportResponse from './ImportResponse.jsx'
import styles from './styles/ImportError.module.css'

const ImportError = ({ response = {} }) => {
    const { conflicts, importCount } = response
    const conflict = conflicts?.[0]?.value
    const allFailed = importCount?.imported === 0 && importCount?.updated === 0

    return (
        <>
            {importCount && !allFailed && (
                <ImportResponse importCount={importCount} />
            )}
            {conflict && (
                <div className={styles.container}>
                    <div className={styles.title}>
                        {allFailed
                            ? i18n.t('Import failed')
                            : i18n.t('One or more conflicts encountered')}
                    </div>
                    <div>{conflict}</div>
                </div>
            )}
        </>
    )
}

ImportError.propTypes = {
    message: PropTypes.string,
    response: PropTypes.object,
}

export default ImportError
