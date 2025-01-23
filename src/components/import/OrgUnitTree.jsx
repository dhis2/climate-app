import i18n from '@dhis2/d2-i18n'
import { OrganisationUnitTree } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useOrgUnitRoots from '../../hooks/useOrgUnitRoots'

const OrgUnitTree = ({ orgUnit, onChange }) => {
    const { roots, error } = useOrgUnitRoots()

    // Set for root node as default
    useEffect(() => {
        if (roots && !orgUnit) {
            const [root] = roots
            onChange({ ...root, selected: [root.path] })
        }
    }, [roots, orgUnit, onChange])

    // The warnings "The query should be static, don't create it within the render loop!"
    // comes from the OrganisationUnitTree component:
    // https://dhis2.slack.com/archives/C0BP0RABF/p1641544953003000
    return roots ? (
        <div>
            <h2>{i18n.t('Parent organisation unit')}</h2>
            <OrganisationUnitTree
                roots={roots.map((r) => r.id)}
                selected={orgUnit?.selected}
                onChange={onChange}
                singleSelection={true}
                initiallyExpanded={roots.map((r) => r.path)}
            />
        </div>
    ) : error ? (
        <div>{error.message}</div>
    ) : null
}

OrgUnitTree.propTypes = {
    onChange: PropTypes.func.isRequired,
    orgUnit: PropTypes.object,
}

export default OrgUnitTree
