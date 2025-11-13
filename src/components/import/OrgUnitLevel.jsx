import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useOrgUnitLevels from '../../hooks/useOrgUnitLevels.js'

const OrgUnitLevel = ({ level, onChange }) => {
    const { levels, loading, error } = useOrgUnitLevels()

    // Set second level as default
    useEffect(() => {
        if (levels?.length > 1 && !level) {
            onChange({ level: String(levels[1].level), name: levels[1].name })
        }
    }, [levels, level, onChange])

    return levels ? (
        <div>
            <SingleSelectField
                selected={level}
                loading={loading}
                error={!!error}
                validationText={error?.message}
                onChange={({ selected }) => {
                    const name = levels.find(
                        (l) => String(l.level) === selected
                    )?.name
                    return onChange({
                        level: selected,
                        name,
                    })
                }}
            >
                {levels.map((l) => (
                    <SingleSelectOption
                        key={l.id}
                        value={String(l.level)}
                        label={l.name}
                    />
                ))}
            </SingleSelectField>
        </div>
    ) : null
}

OrgUnitLevel.propTypes = {
    onChange: PropTypes.func.isRequired,
    level: PropTypes.string,
}

export default OrgUnitLevel
