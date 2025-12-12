import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import HelpfulInfo from '../import/HelpfulInfo.jsx'

const DEFAULT_DATASETS = []

const QUERY = {
    dataSets: {
        resource: 'dataSets',
        params: {
            paging: false,
            fields: 'id,code,displayName,dataSetElements[dataElement[id,code,displayName]],periodType',
        },
    },
}

const DataElement = ({ selected, onChange, datasetCode, periodType }) => {
    const { loading, error, data } = useDataQuery(QUERY)

    const dataSets = data?.dataSets.dataSets || DEFAULT_DATASETS
    const datasetsWithPeriodType = periodType
        ? dataSets.filter(
              (ds) => ds.periodType.toLowerCase() === periodType?.toLowerCase()
          )
        : dataSets
    const dataElements = datasetsWithPeriodType.flatMap(
        (ds) => ds.dataSetElements
    )
    const uniqueDataElements = Array.from(
        dataElements
            .reduce(
                (map, d) => map.set(d.dataElement.id, d.dataElement),
                new Map()
            )
            .values()
    ).sort((a, b) => a.displayName.localeCompare(b.displayName))

    useEffect(() => {
        if (uniqueDataElements.length && datasetCode) {
            const matchingDataElements = uniqueDataElements.filter(
                (dataElement) => dataElement.code?.startsWith(datasetCode)
            )
            if (matchingDataElements.length === 1) {
                onChange(matchingDataElements[0])
            }
        }
    }, [uniqueDataElements, onChange, datasetCode])

    if (loading) {
        return <div>{i18n.t('Loading data elements...')}</div>
    }

    if (error) {
        return (
            <div>
                {i18n.t('Error loading data elements:')} {error.message}
            </div>
        )
    }

    const periodTypeParenth = periodType ? ` (${periodType.toLowerCase()})` : ''

    return (
        <div>
            <SingleSelectField
                label={i18n.t(
                    'Showing data elements from {{periodType}} data sets',
                    {
                        periodType: periodType.toLowerCase(),
                    }
                )}
                filterable
                noMatchText={i18n.t('No match found')}
                selected={selected?.id}
                onChange={({ selected }) =>
                    onChange(uniqueDataElements.find((d) => d.id === selected))
                }
            >
                {uniqueDataElements.map((d) => (
                    <SingleSelectOption
                        key={d.id}
                        value={d.id}
                        label={`${d.displayName}${periodTypeParenth}`}
                    />
                ))}
            </SingleSelectField>
            <HelpfulInfo
                text={
                    <>
                        Need help setting up data elements for import? Check out
                        the <Link to="/setup">setup guide</Link>
                    </>
                }
            />
        </div>
    )
}

DataElement.propTypes = {
    onChange: PropTypes.func.isRequired,
    datasetCode: PropTypes.string,
    periodType: PropTypes.string,
    selected: PropTypes.object,
}

export default DataElement
