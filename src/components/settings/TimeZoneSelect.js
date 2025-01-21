import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'

const timeZones = Intl.supportedValuesOf('timeZone')

const TimeZoneSelect = ({ timeZone, onChange }) =>
    timeZones ? (
        <SingleSelectField
            filterable
            label={i18n.t('Time zone where your org units are located')}
            selected={timeZone}
            onChange={({ selected }) => onChange('timeZone', selected)}
        >
            {timeZones?.map((tz) => (
                <SingleSelectOption key={tz} value={tz} label={tz} />
            ))}
        </SingleSelectField>
    ) : null

TimeZoneSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    timeZone: PropTypes.string,
}

export default TimeZoneSelect
