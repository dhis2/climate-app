import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
    useDataSources,
    ocsProvider,
} from '../components/DataSourcesProvider.jsx'
import { climateDataSet, climateGroup } from '../data/groupings.js'
import { DAILY, MONTHLY, YEARLY } from '../utils/time.js'

const EMPTY_OCS_DATASETS = []

const parsePeriodType = (periodType) => {
    // convert ocs period types to internal period type names
    return {
        daily: DAILY,
        monthly: MONTHLY,
        yearly: YEARLY,
    }[periodType]
}

const parseOcsDataset = (d) => {
    // ocs also has "climatology" dataset templates (eg long-term normals) which
    // aren't tied to a period and so can't be imported
    const periodType = parsePeriodType(d.period_type)
    if (!periodType) {
        return null
    }

    const periodEntry = { periodType }
    if (d.extents?.temporal) {
        periodEntry.periodRange = {
            start: d.extents.temporal.begin,
            end: d.extents.temporal.end,
        }
    }

    return {
        id: d.id,
        name: d.short_name,
        shortName: d.short_name,
        description: d.name,
        units: d.units,
        supportedPeriodTypes: [periodEntry],
        resolution: d.resolution,
        resolutionText: d.resolution
            ? i18n.t('Data resolution is approximately {{resolution}}.', {
                  resolution: d.resolution,
              })
            : undefined,
        variable: d.variable,
        source: d.source,
        dataElementCode: `OCS_${d.id.toUpperCase()}`,
        dataElementGroup: climateGroup,
        dataSet: climateDataSet,
        aggregationType: null,
        provider: ocsProvider,
    }
}

const useOcsDatasets = () => {
    const { ocs } = useDataSources()
    const ocsRoute = ocs.route

    const datasetsUrl = ocsRoute
        ? `${ocsRoute.href}/run/dataset-templates`
        : null

    const fetchDatasetsRaw = async () => {
        try {
            const resp = await fetch(datasetsUrl, { credentials: 'include' })
            if (!resp.ok) {
                throw new Error(
                    `OCS server returned HTTP error at ${datasetsUrl}: ${resp.status} - ${resp.statusText}`
                )
            }
            return resp.json()
        } catch (error) {
            // error could be network failure, CORS, or something else
            if (
                error instanceof TypeError &&
                error.message === 'Failed to fetch'
            ) {
                throw new Error(
                    `Failed to fetch OCS datasets from ${datasetsUrl}. Please check that the route url is configured correctly and has CORS enabled to allow requests from this app's origin.`
                )
            } else {
                console.error(error)
                throw new Error(
                    `Failed to fetch OCS datasets from ${datasetsUrl}: ${error}`
                )
            }
        }
    }

    const {
        data: queryData,
        isLoading: queryLoading,
        error: queryError,
    } = useQuery({
        queryKey: ['use-ocs-datasets'],
        queryFn: fetchDatasetsRaw,
        enabled: !!datasetsUrl,
    })

    const processedData = useMemo(() => {
        if (!queryData) {
            return EMPTY_OCS_DATASETS
        }
        return queryData.map(parseOcsDataset).filter(Boolean)
    }, [queryData])

    const error = !!ocs.error || !!queryError

    return {
        data: processedData,
        loading: ocsRoute && queryLoading && !error,
        error,
    }
}

export default useOcsDatasets
