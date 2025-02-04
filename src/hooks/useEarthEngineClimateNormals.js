import { useState, useEffect } from 'react'
import { getClimateNormals, getCacheKey } from '../utils/ee-utils.js'
import useEarthEngine from './useEarthEngine.js'

const cachedPromise = {}

const useEarthEngineClimateNormals = (dataset, period, feature) => {
    const [data, setData] = useState()
    const eePromise = useEarthEngine()

    useEffect(() => {
        let canceled = false

        if (dataset && period && feature) {
            const key = getCacheKey({ dataset, period, feature })
            const { geometry } = feature

            if (cachedPromise[key]) {
                cachedPromise[key].then((data) => {
                    if (!canceled) {
                        setData(data)
                    }
                })

                return () => {
                    canceled = true
                }
            }

            setData()
            eePromise.then((ee) => {
                cachedPromise[key] = getClimateNormals({
                    ee,
                    dataset,
                    period,
                    geometry,
                })

                cachedPromise[key].then((data) => {
                    if (!canceled) {
                        setData(data)
                    }
                })
            })

            return () => {
                canceled = true
            }
        }
    }, [eePromise, dataset, period, feature])

    return data
}

export default useEarthEngineClimateNormals
