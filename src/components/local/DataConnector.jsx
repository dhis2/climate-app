import { Outlet } from 'react-router-dom'
import DataConnectorDatasetTabs from './DataConnectorDatasetTabs'
import styles from './styles/OrgUnit.module.css'
import localStore from '../../store/localStore'

const DataConnector = () => {
    const { datasets } = localStore()

    return (
        <div className={styles.orgUnit}>
            <DataConnectorDatasetTabs datasets={datasets} />
            
            <Outlet />
        
        </div>
    )
}

export default DataConnector
