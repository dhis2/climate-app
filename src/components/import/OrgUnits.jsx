import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import SectionH2 from '../shared/SectionH2.jsx'
import OrgUnitLevel from './OrgUnitLevel.jsx'
import OrgUnitTree from './OrgUnitTree.jsx'
import classes from './styles/OrgUnits.module.css'

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
            <p className={classes.explainer}>
                {i18n.t(
                    'All organisation units at the selected level within the parent org unit will be included. If the selected parent is on the selected level, then data will be imported for this single org unit only.'
                )}
            </p>
            <h3 className={classes.subheader}>
                {i18n.t('Parent organisation unit')}
            </h3>
            <OrgUnitTree
                orgUnit={parent}
                onChange={(parent) => onChange({ parent, level, levelName })}
            />
            {parentIsBelowLevel === true && (
                <div className={classes.warning}>
                    {i18n.t(
                        'Org unit parent needs to be above or equal to the org unit level'
                    )}
                </div>
            )}
            <h3 className={classes.subheader}>
                {i18n.t('Organisation unit level')}
            </h3>
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
