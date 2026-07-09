import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import useHasDataValueAuthority from '../hooks/useHasDataValueAuthority.js'
import DataLoader from './shared/DataLoader.jsx'
import styles from './styles/RequireAuthority.module.css'

const RequireAuthority = ({ children }) => {
    const { hasAuthority, loading } = useHasDataValueAuthority()

    if (loading) {
        return <DataLoader />
    }

    if (!hasAuthority) {
        return (
            <div className={styles.container}>
                <NoticeBox error title={i18n.t('Page not accessible')}>
                    {i18n.t(
                        'You do not have access to this page. Contact your system administrator if you need access.'
                    )}
                </NoticeBox>
            </div>
        )
    }

    return children
}

RequireAuthority.propTypes = {
    children: PropTypes.node.isRequired,
}

export default RequireAuthority
