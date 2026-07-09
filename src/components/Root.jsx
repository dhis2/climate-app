import i18n from '@dhis2/d2-i18n'
import { CssVariables, CssReset, Menu, MenuItem } from '@dhis2/ui'
import { Fragment, useEffect } from 'react'
import { Outlet, useResolvedPath, useNavigate } from 'react-router-dom'
import useAppSettings from '../hooks/useAppSettings.js'
import useHasDataValueAuthority from '../hooks/useHasDataValueAuthority.js'
import CheckOrgUnitTree from './check/OrgUnitTree.jsx'
import OrgUnitTree from './explore/OrgUnitTree.jsx'
import styles from './styles/Root.module.css'

export const getAppPages = () => [
    { path: '/home', name: i18n.t('Home') },
    { path: '/explore', name: i18n.t('Explore data') },
    { path: '/import', name: i18n.t('Imports'), requiresAuthority: true },
    { path: '/setup', name: i18n.t('Setup guide'), requiresAuthority: true },
    { path: '/settings', name: i18n.t('Settings'), requiresAuthority: true },
]

const Root = () => {
    const { settings } = useAppSettings()
    const { pathname } = useResolvedPath()
    const navigate = useNavigate()
    const { hasAuthority } = useHasDataValueAuthority()

    useEffect(() => {
        if (pathname !== '/') {
            return
        }
        if (hasAuthority === null) {
            return
        }
        if (hasAuthority === false) {
            navigate('/explore')
        } else if (settings?.startPage) {
            navigate(settings.startPage)
        } else {
            navigate('/home')
        }
    }, [settings, pathname, navigate, hasAuthority])

    return (
        <>
            <CssReset />
            <CssVariables spacers colors />
            <div className={styles.container}>
                <div className={styles.sidebar} data-test="sidebar">
                    <Menu>
                        {getAppPages()
                            .filter(
                                ({ requiresAuthority }) =>
                                    !requiresAuthority || hasAuthority !== false
                            )
                            .map(({ path, name }) => (
                                <Fragment key={path}>
                                    <MenuItem
                                        label={name}
                                        onClick={() => navigate(path)}
                                        active={
                                            pathname === path ||
                                            (path !== '/' &&
                                                pathname.startsWith(path))
                                        }
                                        dataTest={`${name
                                            .toLowerCase()
                                            .replaceAll(
                                                /\s+/g,
                                                '-'
                                            )}-menu-item`}
                                    />
                                    {path === '/explore' &&
                                        pathname.startsWith('/explore') && (
                                            <OrgUnitTree />
                                        )}
                                </Fragment>
                            ))}
                        {pathname.startsWith('/check') && (
                            <>
                                <MenuItem
                                    label={i18n.t('Check data')}
                                    active={true}
                                />
                                <CheckOrgUnitTree />
                            </>
                        )}
                    </Menu>
                </div>
                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default Root
