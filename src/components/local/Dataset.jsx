import { Navigate, useParams, Outlet } from 'react-router-dom'
import localStore from '../../store/localStore'

{/*
const Dataset = () => {
    const { orgUnitId, serverId, datasetId } = useParams()
    const { monthlyPeriod } = localStore()

    if (!monthlyPeriod?.startTime) {
        return <p>Preparing dataset view...</p> // Or a loading spinner
    }

    return (
        <Navigate
            replace
            to={`/local/${orgUnitId}/${serverId}/${datasetId}/monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}`}
        />
    )
}
*/}

const Dataset = () => (
    <div>
        <h2>Dataset Wrapper</h2>
        <Outlet />
    </div>
)

export default Dataset