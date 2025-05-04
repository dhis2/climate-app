import { useState, useEffect } from 'react'

const getPeriodFromId = (id) => {
    const year = id.slice(0, 4)
    const month = id.slice(4, 6)
    const day = id.slice(6, 8)
    return `${year}-${month}${day ? `-${day}` : ''}`
}

const parseIds = (data) =>
    data.map((d) => ({ ...d, id: getPeriodFromId(d.id) }))

const stringify = (obj) => {
    return JSON.stringify(obj)
}

const parseResults = (responseData) => {
    /* Should convert to list of [
        {'id': '2025-02', 'value': 0.18},
        {'id': '2025-03', 'value': 0.33},
        {'id': '2025-04', 'value': 0.5},
        {'id': '2025-05', 'value': 0.88}
    ]
    */
    console.log('Raw results', responseData)
    const parsedData = responseData.result.map((item) => ({
        id: item.period,  
        value: item.value, // key is hardcoded for now, needs to be more generic
    }));
    
    console.log('Parsed Results:', parsedData);
    return parsedData; // ✅ Return the parsed results for further use
}

const dataConnectorRequest = ({
    host,
    dataset,
    periodType,
    periodStart,
    periodEnd,
    orgunits
}) => {
    const endpoint = host + '/aggregate'
    const payload = {
        orgunits: JSON.stringify(orgunits),
        dataset: dataset,
        period_type: periodType,
        period_start: periodStart,
        period_end: periodEnd
    }
    console.log('payload', payload)
    const promise = fetch(endpoint, {
        method: 'POST', // HTTP method
        headers: {
            'Content-Type': 'application/json' // Specify JSON payload
        },
        body: JSON.stringify(payload) // Convert payload to JSON string
    });
    return promise
}

const cachedPromise = {}

const getCacheKey = ({ host, dataset, periodType, periodStart, periodEnd, feature }) =>
    JSON.stringify({ host, dataset, periodType, periodStart, periodEnd, feature });

const useDataConnectorTimeSeries = ({
    host,
    dataset,
    period,
    feature,
}) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    console.log('inside useData hook', [data, loading, error])

    const periodIdToType = (periodId) => {
        if (periodId.length === 7) return 'monthly'
        if (periodId.length === 10) return 'daily'
        return null
    }

    const periodStart = period?.startTime
    const periodEnd = period?.endTime
    const periodType = periodIdToType(periodStart)

    useEffect(() => {
        console.log('useData hook effect triggered', [host, dataset, periodType, periodStart, periodEnd, feature])
        if (!host || !dataset || !periodStart || !periodEnd || !feature) {
            return
        }

        let canceled = false
        setLoading(true)
        setError(null)

        const key = getCacheKey({ host, dataset, periodType, periodStart, periodEnd, feature })

        if (cachedPromise[key]) {
            console.log('getting old data from cache', key)
            cachedPromise[key]
                .then((data) => {
                    if (!canceled) {
                        setData(data)
                        setLoading(false)
                        setError(null)
                    }
                })
                .catch((err) => {
                    if (!canceled) {
                        setData(null)
                        setLoading(false)
                        setError(err)
                    }
                })

            return () => {
                canceled = true
            }
        }


        console.log('fetching new data from url')
        setData(null)

        cachedPromise[key] = dataConnectorRequest({
            host,
            dataset,
            periodType,
            periodStart,
            periodEnd,
            orgunits: {type: 'FeatureCollection', features: [feature]},
        })
            .then((response) => response.json())
            .then(parseResults)

        cachedPromise[key]
            .then((data) => {
                if (!canceled) {
                    setData(data)
                    setLoading(false)
                    setError(null)
                }
            })
            .catch((err) => {
                if (!canceled) {
                    console.log('Error fetching dataset', err)
                    setData(null)
                    setLoading(false)
                    setError(err)
                }
            })

        return () => {
            canceled = true
        }
    }, [host, dataset, periodType, periodStart, periodEnd, feature])

    return { data, loading, error }
}

export default useDataConnectorTimeSeries