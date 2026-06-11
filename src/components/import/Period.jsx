import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useSystemInfo from '../../hooks/useSystemInfo.js'
import useUserLocale from '../../hooks/useUserLocale.js'
import {
    MONTHLY,
    WEEKLY,
    YEARLY,
    getPeriodTypes,
    UTC_TIME_ZONE,
} from '../../utils/time.js'
import SectionH2 from '../shared/SectionH2.jsx'
import DateRangePicker from './DateRangePicker.jsx'
import HelpfulInfo from './HelpfulInfo.jsx'

const DEFAULT_DATASET = {}

const Period = ({ period, dataset = DEFAULT_DATASET, onChange }) => {
    const { locale } = useUserLocale()
    const { system } = useSystemInfo()
    const timeZone = system?.systemInfo?.serverTimeZoneId

    // Sync the user's UI locale into the period state so downstream components
    // (CalendarInput, date formatters) pick up the correct locale.
    useEffect(() => {
        if (locale && locale !== period.locale) {
            onChange({ ...period, locale })
        }
    }, [locale, onChange, period])

    // When switching away from a yearly period type, convert the stored year
    // strings back to full ISO date strings.
    useEffect(() => {
        if (period?.periodType !== YEARLY && period?.startTime.length === 4) {
            onChange({
                ...period,
                startTime: period.startTime + '-01-01',
                endTime: period.endTime + '-12-31',
            })
        }
    }, [onChange, period])

    const {
        supportedPeriodTypes: datasetSupportedPeriodTypes,
        period: datasetPeriod,
    } = dataset
    const { periodType } = period

    const matchedPeriodTypeObj = datasetSupportedPeriodTypes?.find(
        (pt) => pt.periodType === periodType
    )
    const datasetPeriodType = matchedPeriodTypeObj?.periodType
    const isYearly = datasetPeriodType === YEARLY

    const datasetFromHourlyData = !!(
        dataset.timeZone || dataset.bands?.[0]?.timeZone
    )

    const getHelpText = () => {
        const periodTypeName = getPeriodTypes().find(
            (pt) => pt.id === periodType
        )?.name
        const periodTypeNoun = getPeriodTypes().find(
            (pt) => pt.id === periodType
        )?.noun

        let helpText = ''
        if (datasetFromHourlyData) {
            if (periodType === WEEKLY || periodType === MONTHLY) {
                helpText = i18n.t(
                    '{{periodTypeName}} data for full calendar {{periodTypeNoun}}s inclusive of start and end dates will be aggregated from hourly data.',
                    { periodTypeName, periodTypeNoun }
                )
            } else {
                helpText = i18n.t(
                    '{{periodTypeName}} data between start and end date will be aggregated from hourly data.',
                    { periodTypeName }
                )
            }
            if (timeZone !== UTC_TIME_ZONE) {
                helpText +=
                    ' ' +
                    i18n.t(
                        'Time zone adjustments will be applied if the selected time zone is not set to UTC.'
                    )
            }
        } else if (periodType === WEEKLY || periodType === MONTHLY) {
            helpText = i18n.t(
                'Data for full calendar {{periodTypeNoun}}s inclusive of start and end dates will be aggregated to {{periodTypeNoun}}ly values.',
                { periodTypeNoun }
            )
        } else {
            helpText = i18n.t(
                'Data between start and end date will be imported as daily values.'
            )
        }
        return helpText
    }

    const sectionTitle = i18n.t('Import date range')

    if (datasetPeriod) {
        return (
            <>
                <SectionH2 number="4" title={sectionTitle} />
                <p>
                    {i18n.t(
                        'The data will be assigned a yearly period type that matches the year it was collected: {{datasetPeriod}}',
                        { datasetPeriod, nsSeparator: ';' }
                    )}
                </p>
            </>
        )
    }

    return (
        <>
            <SectionH2 number="4" title={sectionTitle} />
            <DateRangePicker
                key={dataset?.id || 'default'}
                period={period}
                dataset={dataset}
                onChange={onChange}
            />
            {!isYearly && <HelpfulInfo text={getHelpText()} />}
        </>
    )
}

Period.propTypes = {
    period: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    dataset: PropTypes.object,
}

export default Period
