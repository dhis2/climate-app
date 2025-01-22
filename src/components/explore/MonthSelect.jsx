import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import exploreStore from '../../store/exploreStore'

export const months = [
    {
        id: 1,
        name: i18n.t('January'),
    },
    {
        id: 2,
        name: i18n.t('February'),
    },
    {
        id: 3,
        name: i18n.t('March'),
    },
    {
        id: 4,
        name: i18n.t('April'),
    },
    {
        id: 5,
        name: i18n.t('May'),
    },
    {
        id: 6,
        name: i18n.t('June'),
    },
    {
        id: 7,
        name: i18n.t('July'),
    },
    {
        id: 8,
        name: i18n.t('August'),
    },
    {
        id: 9,
        name: i18n.t('September'),
    },
    {
        id: 10,
        name: i18n.t('October'),
    },
    {
        id: 11,
        name: i18n.t('November'),
    },
    {
        id: 12,
        name: i18n.t('December'),
    },
]

const MonthSelect = () => {
    const { month, setMonth } = exploreStore()

    return (
        <SingleSelectField
            label={i18n.t('Month')}
            selected={String(month)}
            onChange={({ selected }) => setMonth(Number(selected))}
        >
            {months.map((d) => (
                <SingleSelectOption
                    key={d.id}
                    value={String(d.id)}
                    label={d.name}
                />
            ))}
        </SingleSelectField>
    )
}

export default MonthSelect
