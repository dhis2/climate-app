import { useParams, Navigate } from 'react-router-dom'
import localStore from '../../store/localStore'

const DatasetRedirect = () => {
    const { orgUnitId, serverId, datasetId } = useParams()
    const { monthlyPeriod } = localStore()

    if (!monthlyPeriod?.startTime) {
        return <p>Preparing redirect...</p> // Optional fallback
    }

    console.log('Redirecting to:', `/local/${orgUnitId}/${serverId}/${datasetId}/monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}`)

    return (
        <>
            <p>THIS SHOULD REDIRECT</p>
            <Navigate
                replace
                to={`monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}`}
            />
        </>
    )
}

export default DatasetRedirect
