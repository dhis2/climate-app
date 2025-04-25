import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import localStore from '../../store/localStore'
import { CircularLoader } from '@dhis2/ui'
import DataLoader from '../shared/DataLoader'

const DatasetRedirect = () => {
    const { orgUnitId, serverId, datasetId } = useParams()
    const navigate = useNavigate()
    const { monthlyPeriod } = localStore()

    useEffect(() => {
        if (monthlyPeriod?.startTime && monthlyPeriod?.endTime) {
            const path = `monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}`
            console.log(`🚀 Redirecting to: ${path}`)
            navigate(path, { replace: true })
        }
    }, [monthlyPeriod, navigate])

    return <DataLoader />
}

export default DatasetRedirect
