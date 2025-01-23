import { CustomDataProvider } from '@dhis2/app-runtime'
import { OrganisationUnitTree } from '@dhis2/ui'
import { useNavigate } from 'react-router-dom'
import { locations, findLocation } from '../../data/locations'
import exploreStore from '../../store/exploreStore'
import styles from '../explore/styles/OrgUnitTree.module.css'

// Inspired by https://github.com/dhis2/ui/blob/master/components/organisation-unit-tree/src/__stories__/shared.js

const createResponse = ({ fields, id, path, displayName, children }) => ({
    ...(fields.includes('id') ? { id } : {}),
    ...(fields.includes('path') ? { path } : {}),
    ...(fields.includes('displayName') ? { displayName } : {}),
    ...(fields.includes('children::size') ? { children: children.length } : {}),
    ...(fields.includes('children[id,path,displayName]') ? { children } : {}),
})

const getOrganisationUnitData = (id, { fields }) =>
    Promise.resolve(
        createResponse({
            fields,
            ...findLocation(id),
        })
    )

const customData = {
    organisationUnits: (_, { id, params = {} }) => {
        const data = getOrganisationUnitData(id, params)

        if (!data) {
            return Promise.reject(new Error('404 - Org unit not found'))
        }

        return Promise.resolve(data)
    },
}

const OrgUnitTree = () => {
    const { orgUnit } = exploreStore()
    const navigate = useNavigate()

    const roots = [locations]
    const path = orgUnit?.path.split('/')

    const initiallyExpanded =
        path?.length > 2
            ? [path.slice(0, -1).join('/')]
            : roots.map((r) => r.path)

    const selected = orgUnit?.path ? [orgUnit.path] : []

    const onChange = (orgUnit) => navigate(`/check/${orgUnit.id}`)

    return (
        <div className={styles.container}>
            <div className={styles.orgUnitTree}>
                <CustomDataProvider data={customData}>
                    <OrganisationUnitTree
                        roots={roots.map((r) => r.id)}
                        selected={selected}
                        onChange={onChange}
                        singleSelection={true}
                        initiallyExpanded={initiallyExpanded}
                    />
                </CustomDataProvider>
            </div>
        </div>
    )
}

export default OrgUnitTree
