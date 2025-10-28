import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
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

    if (error) {
        console.error('Error loading org unit roots', error)
        return <div>{error.message}</div>
    }

    if (!roots) {
        return <div>{i18n.t('Loading organisation units...')}</div>
    }

    return (
        <div className={classes.container}>
            <OrganisationUnitTree
                roots={roots.map((r) => r.id)}
                selected={orgUnit?.selected}
                onChange={onChange}
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
