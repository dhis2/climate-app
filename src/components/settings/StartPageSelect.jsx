import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { getAppPages } from '../Root.jsx'

const StartPageSelect = ({ startPage, onChange }) => (
    <SingleSelectField
        label={i18n.t('Default start page for users')}
        selected={startPage || getAppPages()[0].path}
        onChange={({ selected }) => onChange('startPage', selected)}
    >
        {getAppPages().map(({ path, name }) => (
            <SingleSelectOption key={path} value={path} label={name} />
        ))}
    </SingleSelectField>
)

StartPageSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    startPage: PropTypes.string,
}

export default StartPageSelect
