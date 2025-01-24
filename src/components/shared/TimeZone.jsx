import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useSystemInfo from '../../hooks/useSystemInfo.js'

const utcTimeZone = 'Etc/UTC'

// TODO: Use daylight saving time?
const TimeZone = ({ period, onChange }) => {
    const { system } = useSystemInfo()

    const timeZone = system?.systemInfo?.serverTimeZoneId

    useEffect(() => {
        if (timeZone && timeZone !== utcTimeZone) {
            onChange((period) => ({
                ...period,
                timeZone: timeZone,
            }))
        }
    }, [timeZone, onChange])

    if (!timeZone || timeZone === utcTimeZone) {
        return null
    }

    return (
        <SingleSelectField
            label={i18n.t('Time zone')}
            selected={period.timeZone || utcTimeZone}
            onChange={({ selected }) =>
                onChange({
                    ...period,
                    timeZone: selected !== utcTimeZone ? selected : undefined,
                })
            }
        >
            <SingleSelectOption value={timeZone} label={timeZone} />
            <SingleSelectOption value={utcTimeZone} label={utcTimeZone} />
        </SingleSelectField>
    )
}
TimeZone.propTypes = {
    period: PropTypes.object,
    onChange: PropTypes.func,
}

export default TimeZone
