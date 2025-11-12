import i18n from '@dhis2/d2-i18n'
import { Radio, Field } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { periodTypes } from '../../utils/time.js'

const defaultPeriodTypes = ['DAILY', 'WEEKLY', 'MONTHLY']

const PeriodType = ({ periodType, supportedPeriodTypes, onChange }) => {
    // get period type objects from supported period type ids, or use defaults
    const supportedPeriodTypeObjects = supportedPeriodTypes
        ? periodTypes?.filter((type) => supportedPeriodTypes.includes(type.id))
        : periodTypes.filter((type) => defaultPeriodTypes.includes(type.id))

    // make sure selected period type is supported by dataset period type, or set to undefined
    let selectedPeriodType = supportedPeriodTypeObjects
        .map((type) => type.id)
        .includes(periodType)
        ? periodType
        : undefined

    // if period type is unsupported, set to first allowable type
    if (
        supportedPeriodTypeObjects.length > 0 &&
        selectedPeriodType === undefined
    ) {
        selectedPeriodType = supportedPeriodTypeObjects[0].id
        onChange(selectedPeriodType)
    }

    return (
        <div style={{ display: 'flex', marginTop: '16px' }}>
            <Field label={i18n.t('Period aggregation level')}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {supportedPeriodTypeObjects.map((type) => (
                        <Radio
                            key={type.id}
                            name="periodType"
                            value={type.id}
                            label={type.name}
                            disabled={
                                !supportedPeriodTypes ||
                                supportedPeriodTypes.length === 1
                            }
                            checked={selectedPeriodType === type.id}
                            onChange={({ value }) => onChange(value)}
                        />
                    ))}
                </div>
            </Field>
        </div>
    )
}

PeriodType.propTypes = {
    periodType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    supportedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
}

export default PeriodType
