import { useState, useEffect } from "react";

const apiUrl = 'http://168.253.224.242:9091/dst';
const apiKey = 'lyKKVwxx8m2UD65Q'

const parseIriAggregateResults = (results) => {
    // need to convert from original iri results
    // to structure expected by the climate app
    // ie: ou, period, value
    return results
}

const useIriData = (dataset, period, features) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState();

    const downloadUrl = `${apiUrl}/download_raw_data`;
    
    useEffect(() => {
        fetch(downloadUrl, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey, // can also be Authorization or apiKey
            },
            body : JSON.stringify({
                variable: dataset.variable,
                temporalRes: dataset.periodType, // need converting? 
                startDate: dataset.period.startDate,
                endDate: dataset.period.endDate,
                geomExtract: 'geojson',
                geojsonSource: 'upload',
                geojsonData: {type: 'FeatureCollection', features},
                geojsonField: 'id', // can we always expect this? 
                outFormat: 'JSON-Format',
            })

        }).then(res => {
            if (res.status == 400) {
                setLoading(false)
                setError({message :"Something went wrong"})
            }
            const parsed = parseIriAggregateResults(res.json())
            return parsed

        }).then(data => {
            console.log(data)
            setLoading(false)
            setData(data)

        } ).catch(err => {
            console.log(err)
            setError(err)
            setLoading(false)
        })
    }, [dataset,period,features])

    return {data, error, loading}
  
} 

export default useIriData;