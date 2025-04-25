import useAppSettings from '../../hooks/useAppSettings.js'
import useDataConnectorTimeSeries from '../../hooks/useDataConnectorTimeSeries.js'
import localStore from '../../store/localStore.js'
import DataLoader from '../shared/DataLoader.jsx'
import Resolution from '../shared/Resolution.jsx'
import Chart from './Chart.jsx'
import MonthlyPeriodSelect from './MonthlyPeriodSelect.jsx'
import PeriodTypeSelect from './PeriodTypeSelect.jsx'
import getMonthlyConfig from './chartConfigs/datasetMonthly'
import { useParams, useLoaderData } from 'react-router-dom'
import { NoticeBox } from '@dhis2/ui'

const DatasetMonthly = () => {
    const orgUnit = useLoaderData()
    const period = localStore((state) => state.monthlyPeriod)
    const { dataConnector, datasets } = localStore()
    const { settings } = useAppSettings()
    const { serverId, datasetId } = useParams()

    console.log('DATASET MONTHLY ELEMENT')
    console.log('dataConnector', dataConnector)
    console.log('datasets', datasets)

    const dataset = datasets.find((d) => d.id == datasetId)
    console.log('dataset obj', dataset)

    console.log('fetching', [dataConnector.url,datasetId,period,orgUnit])
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
                    config={getMonthlyConfig({
                        name,
                        data,
                        settings,
                    })}
                />
            ) : (
                <DataLoader />
            )}
            <MonthlyPeriodSelect />
            <Resolution resolution={dataset.resolution} />
        </>
    )
}

export default DatasetMonthly
