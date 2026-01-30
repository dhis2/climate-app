import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useSystemInfo from '../../hooks/useSystemInfo.js'
import { UTC_TIME_ZONE } from '../../utils/time.js'

const TimeZone = ({ period, onChange }) => {
    const { system } = useSystemInfo()

    const timeZone = system?.systemInfo?.serverTimeZoneId

    useEffect(() => {
        if (timeZone && timeZone !== UTC_TIME_ZONE) {
            onChange((period) => ({
                ...period,
                timeZone: timeZone,
            }))
        }
    }, [timeZone, onChange])

    if (!timeZone || timeZone === UTC_TIME_ZONE) {
        return null
    }

    return (
        <SingleSelectField
            label={i18n.t('Time zone')}
            selected={period.timeZone || UTC_TIME_ZONE}
            onChange={({ selected }) =>
                onChange({
                    ...period,
                    timeZone: selected !== UTC_TIME_ZONE ? selected : undefined,
                })
            }
            dataTest={'time-zone-select'}
        >
            <SingleSelectOption value={timeZone} label={timeZone} />
            <SingleSelectOption value={UTC_TIME_ZONE} label={UTC_TIME_ZONE} />
        </SingleSelectField>
    )
}
TimeZone.propTypes = {
    period: PropTypes.object,
    onChange: PropTypes.func,
}

export default TimeZone
