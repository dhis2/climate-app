import i18n from '@dhis2/d2-i18n'
import { Radio, Field } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { periodTypes, DAILY, WEEKLY, MONTHLY } from '../../utils/time.js'

const defaultPeriodTypes = new Set([DAILY, WEEKLY, MONTHLY])

const PeriodType = ({ periodType, supportedPeriodTypes, onChange }) => {
    // get period type objects from supported period type ids, or use defaults
    const supportedPeriodTypeObjects = supportedPeriodTypes
        ? periodTypes?.filter((type) => supportedPeriodTypes.includes(type.id))
        : periodTypes.filter((type) => defaultPeriodTypes.has(type.id))

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

    // If there's only one supported period type, show just the text
    if (supportedPeriodTypeObjects.length === 1) {
        return (
            <div style={{ marginTop: '16px', fontSize: '14px' }}>
                <div>
                    {i18n.t('Period type')}:{' '}
                    {supportedPeriodTypeObjects[0].name}
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', marginTop: '16px' }}>
            <Field label={i18n.t('Period type')}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {supportedPeriodTypeObjects.map((type) => (
                        <Radio
                            key={type.id}
                            name="periodType"
                            value={type.id}
                            label={type.name}
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
