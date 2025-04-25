import { useEffect } from 'react'
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom'
import localStore from '../../store/localStore'
import { CircularLoader } from '@dhis2/ui'
import DataLoader from '../shared/DataLoader'

const DatasetRedirect = () => {
    const { orgUnitId, serverId, datasetId } = useParams()
    const navigate = useNavigate()
    const curPath = useLocation().pathname
    const { periodType, monthlyPeriod, dailyPeriod } = localStore()
    console.log('Entered dataset redirect', curPath, periodType)

    useEffect(() => {
        console.log('Checking for redirect', [curPath, periodType, monthlyPeriod, dailyPeriod])
        if (curPath.endsWith(`/${datasetId}`)) {
            // no period selected yet
            const path = `monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}`
            console.log(`Redirecting to default period type: ${path}`)
            navigate(path, { replace: true })
        } else if (periodType == 'MONTHLY') {
            // switch to month if needed
            if (!curPath.includes('/monthly/') && monthlyPeriod?.startTime && monthlyPeriod?.endTime) {
                const path = `monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}`
                console.log(`Changed to monthly, redirecting to: ${path}`)
                navigate(path, { replace: true })
            }
        } else if (periodType == 'DAILY') {
            // switch to day if needed
            if (!curPath.includes('/daily/') && dailyPeriod?.startTime && dailyPeriod?.endTime) {
                const path = `daily/${dailyPeriod.startTime}/${dailyPeriod.endTime}`
                console.log(`Changed to daily, redirecting to: ${path}`)
                navigate(path, { replace: true })
            }
        }
    }, [curPath, periodType, monthlyPeriod, dailyPeriod, navigate])

    return <Outlet />
}

export default DatasetRedirect
