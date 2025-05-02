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
        console.log('Running redirect useEffect', [curPath, periodType, monthlyPeriod, dailyPeriod])
        if (curPath.endsWith(`/${datasetId}`)) {
            // no period selected yet
            const path = `monthly/${monthlyPeriod.startTime}/${monthlyPeriod.endTime}`
            console.log(`Redirecting to default period type: ${path}`)
            navigate(path, { replace: true })
        } else if (curPath.includes('/monthly/') && (monthlyPeriod?.startTime.length != 7 | monthlyPeriod?.endTime.length != 7)) {
            // monthly period params do not have correct format
            const path = `monthly/${monthlyPeriod.startTime.slice(0,7)}/${monthlyPeriod.endTime.slice(0,7)}`
            console.log(`Attempting to fix incorrect month values, redirecting to: ${path}`)
            navigate(path, { replace: true })
        } else if (curPath.includes('/daily/') && (dailyPeriod?.startTime.length != 10 | dailyPeriod?.endTime.length != 10)) {
            // daily period params do not have correct format
            let newStartTime = dailyPeriod.startTime
            let newEndTime = dailyPeriod.endTime
            if (newStartTime.length == 7) {newStartTime = newStartTime + '-01'}
            if (newEndTime.length == 7) {
                const [year,month] = newEndTime.split('-')
                newEndTime = new Date(year, month, 0).toISOString().split('T')[0]
            }
            const path = `daily/${newStartTime}/${newEndTime}`
            console.log(`Attempting to fix incorrect day values, redirecting to: ${path}`)
            navigate(path, { replace: true })
        }
    }, [curPath, periodType, monthlyPeriod, dailyPeriod, navigate])

    return <Outlet />
}

export default DatasetRedirect
