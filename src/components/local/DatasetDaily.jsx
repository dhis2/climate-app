import useAppSettings from '../../hooks/useAppSettings.js'
import useDataConnectorTimeSeries from '../../hooks/useDataConnectorTimeSeries.js'
import localStore from '../../store/localStore.js'
import DataLoader from '../shared/DataLoader.jsx'
import Resolution from '../shared/Resolution.jsx'
import Chart from './Chart.jsx'
import DailyPeriodSelect from './DailyPeriodSelect.jsx'
import PeriodTypeSelect from './PeriodTypeSelect.jsx'
import getDailyConfig from './chartConfigs/datasetDaily.js'
import { useParams, useLoaderData } from 'react-router-dom'
import { NoticeBox } from '@dhis2/ui'

const DatasetDaily = () => {
    const orgUnit = useLoaderData()
    const period = localStore((state) => state.dailyPeriod)
    const { dataConnector, datasets } = localStore()
    const { settings } = useAppSettings()
    const { serverId, datasetId } = useParams()

    const dataset = datasets.find((d) => d.id == datasetId)
    console.log('dataset obj', dataset)

    const {data, loading, error} = useDataConnectorTimeSeries({
        host: dataConnector.url,
        dataset: datasetId,
        period,
        feature: orgUnit,
    })

    const { name } = orgUnit.properties

    return (
        <>
            <PeriodTypeSelect />
            {error && (
                <NoticeBox error title="Error loading dataset">
                    There was a problem fetching the dataset. Please try again later.
                </NoticeBox>
            )}
            {data && settings ? (
                <Chart
                    config={getDailyConfig({
                        orgUnitName: name,
                        dataset,
                        data,
                        settings,
                    })}
                />
            ) : (
                <DataLoader />
            )}
            <DailyPeriodSelect />
            <Resolution resolution={dataset.resolution} />
        </>
    )
}

export default DatasetDaily
