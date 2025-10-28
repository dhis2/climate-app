import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import classes from './styles/Dhis2DataSet.module.css'

const QUERY = {
    dataSets: {
        resource: 'dataSets',
        params: {
            paging: false,
            fields: 'id,code,displayName,dataSetElements[dataElement[id,code,displayName]],periodType',
        },
    },
}

const NO_DATASETS = []

const Dhis2DataSet = ({ selected, onChange, periodType, dataset }) => {
    const { loading, error, data } = useDataQuery(QUERY)
    const [datasets, setDatasets] = useState([])

    useEffect(() => {
        const ds = data?.dataSets.dataSets.filter(
            (ds) => ds.periodType.toLowerCase() === periodType.toLowerCase()
        )

        setDatasets(() => {
            const newDatasets = ds || NO_DATASETS

            if (!selected && dataset?.id) {
                if (newDatasets.length === 1) {
                    onChange(newDatasets[0])
                } else if (newDatasets.length > 1) {
                    const climateWeatherDatasets = newDatasets.filter((nds) =>
                        nds.code?.startsWith(dataset?.dataSet?.dhis2Code)
                    )
                    if (climateWeatherDatasets.length === 1) {
                        onChange(climateWeatherDatasets[0])
                    } else {
                        onChange(null)
                    }
                }
            }

            return newDatasets
        })
    }, [data, periodType, onChange, selected, dataset])

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
            <div className={classes.group}>
                <div style={{ flexGrow: 1 }}>
                    <SingleSelectField
                        label="Dhis2 data set"
                        filterable
                        noMatchText={i18n.t('No match found')}
                        selected={selected?.id}
                        loading={loading}
                        error={!!error}
                        validationText={error?.message}
                        onChange={({ selected }) =>
                            onChange(datasets.find((d) => d.id === selected))
                        }
                    >
                        {datasets.map((d) => (
                            <SingleSelectOption
                                key={d.id}
                                value={d.id}
                                label={`${d.displayName}${periodTypeParenth}`}
                            />
                        ))}
                    </SingleSelectField>
                </div>
            </div>
        </div>
    )
}

Dhis2DataSet.propTypes = {
    onChange: PropTypes.func.isRequired,
    dataset: PropTypes.shape({
        dataSet: PropTypes.shape({
            dhis2Code: PropTypes.string,
        }),
        id: PropTypes.string,
    }),
    periodType: PropTypes.string,
    selected: PropTypes.object,
}

export default Dhis2DataSet
