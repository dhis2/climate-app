import { useState, useEffect } from 'react'
import { getEarthEngineData } from '../utils/ee-utils.js'
import useEarthEngine from './useEarthEngine.js'

const useEarthEngineData = ({
    dataset,
    period,
    features,
    featurePayloadMbLimit,
}) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [progress, setProgress] = useState({ current: 0, total: 0 })
    const eePromise = useEarthEngine()

    useEffect(() => {
        if (dataset && features?.length) {
            setLoading(true)
            setData()
            eePromise.then((ee) =>
                getEarthEngineData({
                    ee,
                    dataset,
                    period,
                    features,
                    featurePayloadMbLimit,
                    onProgress: (current, total) =>
                        setProgress({ current, total }),
                })
                    .then((data) => {
                        setData(data)
                        setLoading(false)
                    })
                    .catch((error) => {
                        setError(error)
                        setLoading(false)
                    })
            )
        }
    }, [eePromise, dataset, period, features, featurePayloadMbLimit])

    return { data, error, loading, progress }
}

export default useEarthEngineData
