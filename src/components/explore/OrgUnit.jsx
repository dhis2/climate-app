import i18n from '@dhis2/d2-i18n'
import { useEffect } from 'react'
import {
    Outlet,
    useLoaderData,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import exploreStore from '../../store/exploreStore'
import OrgUnitType from './OrgUnitType.jsx'
import styles from './styles/OrgUnit.module.css'

const tabIsValid = (tab, orgUnit) =>
    tab === 'forecast10days' && orgUnit.geometry.type !== 'Point' ? false : true

const OrgUnit = () => {
    const { pathname } = useLocation()
    const orgUnit = useLoaderData()
    const { tab, setTab, setOrgUnit } = exploreStore()
    const navigate = useNavigate()
    const path = pathname.split('/')

    const section = path[1]
    const uriTab = path[3]

    useEffect(() => {
        setOrgUnit(orgUnit)
        return () => {
            setOrgUnit(null)
        }
    }, [orgUnit, setOrgUnit])

    // Set default type based on org unit geometry type
    useEffect(() => {
        if (!uriTab && orgUnit.geometry) {
            if (tab && tabIsValid(tab, orgUnit)) {
                navigate(`/${section}/${orgUnit.id}/${tab}`)
            } else {
                setTab(
                    orgUnit.geometry.type === 'Point'
                        ? 'forecast10days'
                        : 'temperature'
                )
            }
        }
    }, [orgUnit, section, tab, uriTab, setTab, navigate])

    return (
        <div className={styles.container}>
            <div className={styles.orgUnit}>
                <h1>
                    {orgUnit.properties.name}{' '}
                    <OrgUnitType type={orgUnit?.geometry?.type} />
                </h1>
                {orgUnit.geometry ? (
                    <Outlet />
                ) : (
                    <div className={styles.message}>
                        {i18n.t('No geometry found')}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrgUnit
