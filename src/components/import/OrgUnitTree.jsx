import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect, useCallback } from 'react'
import useOrgUnitRoots from '../../hooks/useOrgUnitRoots.js'
import classes from './styles/OrgUnitTree.module.css'

const OrgUnitTree = ({ orgUnit, onChange }) => {
    const { roots, error } = useOrgUnitRoots()

    // Set for root node as default
    useEffect(() => {
        if (roots && !orgUnit) {
            const [root] = roots
            onChange({ ...root, selected: [root.path] })
        }
    }, [roots, orgUnit, onChange])

    const onChangeOU = useCallback(
        (ou) => {
            const level = ou.path.split('/').filter(Boolean).length
            onChange({ ...ou, level })
        },
        [onChange]
    )

    if (error) {
        console.error('Error loading org unit roots', error)
        return <div>{error.message}</div>
    }

    if (!roots) {
        return <div>{i18n.t('Loading organisation units...')}</div>
    }

    // The warnings "The query should be static, don't create it within the render loop!"
    // comes from the OrganisationUnitTree component:
    // https://dhis2.slack.com/archives/C0BP0RABF/p1641544953003000
    return (
        <div className={classes.container}>
            <OrganisationUnitTree
                roots={roots.map((r) => r.id)}
                selected={orgUnit?.selected}
                onChange={onChangeOU}
                singleSelection={true}
                initiallyExpanded={roots.map((r) => r.path)}
            />
        </div>
    )
}

OrgUnitTree.propTypes = {
    onChange: PropTypes.func.isRequired,
    orgUnit: PropTypes.object,
}

export default OrgUnitTree
