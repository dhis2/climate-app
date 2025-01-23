import { OrganisationUnitTree } from '@dhis2/ui'
import { useNavigate } from 'react-router-dom'
import useOrgUnitRoots from '../../hooks/useOrgUnitRoots'
import exploreStore from '../../store/exploreStore'
import styles from './styles/OrgUnitTree.module.css'

const OrgUnitTree = () => {
    const { orgUnit } = exploreStore()
    const { roots } = useOrgUnitRoots()
    const navigate = useNavigate()
    const path = orgUnit?.path.split('/')

    const initiallyExpanded =
        path?.length > 2
            ? [path.slice(0, -1).join('/')]
            : roots?.map((r) => r.path)

    const selected = orgUnit?.path ? [orgUnit.path] : []

    const onChange = (orgUnit) => navigate(`/explore/${orgUnit.id}`)

    return roots ? (
        <div className={styles.container}>
            <div className={styles.orgUnitTree}>
                <OrganisationUnitTree
                    roots={roots.map((r) => r.id)}
                    selected={selected}
                    onChange={onChange}
                    singleSelection={true}
                    initiallyExpanded={initiallyExpanded}
                />
            </div>
        </div>
    ) : null
}

export default OrgUnitTree
