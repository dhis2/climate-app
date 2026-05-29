import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import styles from './styles/ImportResponse.module.css'

const DEFAULT_ARRAY = []

const resolveOrgUnitNames = (indexes, sentDataValues, features) => {
    const ids = indexes.map((i) => sentDataValues[i]?.orgUnit).filter(Boolean)
    return [...new Set(ids)].map(
        (id) => features.find((f) => f.id === id)?.properties?.name ?? id
    )
}

const ImportResponse = ({
    importCount,
    conflicts,
    noDataOrgUnits = DEFAULT_ARRAY,
    period,
    sentDataValues = DEFAULT_ARRAY,
    features = DEFAULT_ARRAY,
}) => {
    const { imported, updated, ignored, missing } = importCount
    const allFailed = imported === 0 && updated === 0 && ignored === 0

    const renderConflict = (conflict, idx) => {
        if (conflict.errorCode === 'E7619') {
            const orgUnitNames = resolveOrgUnitNames(
                conflict.indexes ?? [],
                sentDataValues,
                features
            )
            const value = sentDataValues[conflict.indexes?.[0]]?.value
            return (
                <div key={idx}>
                    {i18n.t(
                        'No data for the following org units: {{orgUnits}}',
                        {
                            orgUnits: orgUnitNames.join(', '),
                            nsSeparator: ';',
                        }
                    )}
                    {value !== undefined && (
                        <>
                            <br />
                            {i18n.t("Value '{{value}}' is not numeric", {
                                value,
                                nsSeparator: ';',
                            })}
                        </>
                    )}
                </div>
            )
        }
        return <div key={idx}>{conflict.value}</div>
    }

    return (
        <div>
            {!allFailed && (
                <div className={styles.container}>
                    <div className={styles.title}>
                        {i18n.t('Data is imported')}
                    </div>
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
                </div>
            )}
            {noDataOrgUnits.length > 0 && (
                <div className={styles.conflicts}>
                    {period
                        ? i18n.t(
                              'No data between {{startTime}} and {{endTime}} for the following org units: {{orgUnits}}',
                              {
                                  startTime: period.startTime,
                                  endTime: period.endTime,
                                  orgUnits: noDataOrgUnits.join(', '),
                                  nsSeparator: ';',
                              }
                          )
                        : i18n.t(
                              'No data for the following org units: {{orgUnits}}',
                              {
                                  orgUnits: noDataOrgUnits.join(', '),
                                  nsSeparator: ';',
                              }
                          )}
                </div>
            )}
            {conflicts?.length > 0 && (
                <div className={styles.conflicts}>
                    <div className={styles.title}>
                        {allFailed
                            ? i18n.t('Import failed')
                            : i18n.t('One or more conflicts encountered')}
                    </div>
                    {conflicts.map(renderConflict)}
                </div>
            )}
        </div>
    )
}

ImportResponse.propTypes = {
    importCount: PropTypes.object.isRequired,
    conflicts: PropTypes.array,
    features: PropTypes.array,
    noDataOrgUnits: PropTypes.array,
    period: PropTypes.shape({
        endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    sentDataValues: PropTypes.array,
}

export default ImportResponse
