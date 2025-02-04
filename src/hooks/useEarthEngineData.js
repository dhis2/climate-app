import { useState, useEffect } from 'react'
import { getEarthEngineData } from '../utils/ee-utils.js'
import useEarthEngine from './useEarthEngine.js'

const useEarthEngineData = (dataset, period, features) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState()
    const [error, setError] = useState()
    const eePromise = useEarthEngine()

    useEffect(() => {
        if (dataset && features?.length) {
            setLoading(true)
            setData()
            eePromise.then((ee) =>
                getEarthEngineData({ ee, dataset, period, features })
                    .then((data) => {
                        setData(data)
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.error('Error loading Earth Engine data', error)
                        setError(error)
                        setLoading(false)
                    })
            )
        }
    }, [eePromise, dataset, period, features])

    return { data, error, loading }
}

export default useEarthEngineData
