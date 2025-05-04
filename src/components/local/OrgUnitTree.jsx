import { OrganisationUnitTree } from '@dhis2/ui'
import { useNavigate, useLocation, useLoaderData } from 'react-router-dom'
import useOrgUnitRoots from '../../hooks/useOrgUnitRoots.js'
import localStore from '../../store/localStore.js'
import styles from './styles/OrgUnitTree.module.css'

const OrgUnitTree = () => {
    const { orgUnit } = localStore()
    const { roots } = useOrgUnitRoots()
    const curPath = useLocation().pathname
    const navigate = useNavigate()
    const orgUnitPath = orgUnit?.path.split('/')

    console.log('orgunit select', orgUnit)

    const initiallyExpanded =
        orgUnitPath?.length > 2
            ? [orgUnitPath.slice(0, -1).join('/')]
            : roots?.map((r) => r.path)

    const selected = orgUnit?.path ? [orgUnit.path] : []

    const onChange = (orgUnit) => {
        // TODO: hacky changing of url path
        const parts = curPath.split('/')
        parts[2] = orgUnit.id
        const newPath = parts.join('/')
        console.log(`Navigating from ${curPath} to ${newPath}`)
        navigate(newPath)
    }

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
