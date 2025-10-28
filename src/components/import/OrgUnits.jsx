import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import SectionH2 from '../shared/SectionH2.jsx'
import OrgUnitLevel from './OrgUnitLevel.jsx'
import OrgUnitTree from './OrgUnitTree.jsx'
import styles from './styles/OrgUnits.module.css'

const DEFAULT_SELECTED = {}

const OrgUnits = ({ selected = DEFAULT_SELECTED, onChange }) => {
    const { parent, level, levelName } = selected

    const parentIsBelowLevel =
        parent && level && parent.path.split('/').length - 1 > Number(level)

    return (
        <>
            <SectionH2
                number="4"
                title={i18n.t('Select organisation unit and level')}
            />
            <p>
                {i18n.t(
                    'First choose an organisation unit. All units at the selected level within this org unit will be included'
                )}
            </p>
            <OrgUnitTree
                orgUnit={parent}
                onChange={(parent) => onChange({ parent, level, levelName })}
            />
            {parentIsBelowLevel === true && (
                <div className={styles.warning}>
                    {i18n.t(
                        'Org unit parent needs to be above or equal to the org unit level'
                    )}
                </div>
            )}
            <p>
                {i18n.t(
                    'Next choose the organisation unit level that data will be imported to'
                )}
            </p>
            <OrgUnitLevel
                level={level}
                onChange={(orgUnitLevel) => {
                    return onChange({
                        parent,
                        level: orgUnitLevel.level,
                        levelName: orgUnitLevel.name,
                    })
                }}
            />
        </>
    )
}

OrgUnits.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.object,
}

export default OrgUnits
