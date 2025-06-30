import { useState, useEffect } from "react";

const apiUrl = 'http://168.253.224.242:9091/dst';

const parseIriDataset = (d) => {
    console.log('received iri dataset', d)
    parsed = {
        id: `${d.dataset_name}-${d.variable_name}-${d.temporal_resolution}`,
        name: `${d.dataset_longname} - ${d.variable_longname} (IRI ENACTS)`,
        shortName: `${d.dataset_longname} - ${d.variable_longname}`,
        units: d.variable_units,
        periodType: d.temporal_resolution,
        temporalAggregation: 'mean', // how to determine, maybe not allowed?...
        spatialAggregation: 'mean', // how to determine, maybe not allowed?...
        resolution: `${d.spatial_resolution.lon} degrees x ${d.spatial_resolution.lat} degrees`,
        source: 'IRI ENACTS Data Sharing Tool (DST)',
        sourceUrl: `${apiUrl}/dst/`,
        variable: d.variable_name,
        provider: 'iri',
    }
    return parsed
}

const useIriDatasets = (dataset, period, features) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState();

    const datasetsUrl = `${apiUrl}/dataset_info`;
    
    useEffect(() => {
        console.log('fetching iri datasets', datasetsUrl)
        fetch(datasetsUrl, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
            
        }).then(res => {
            if (res.status == 400) {
                setLoading(false)
                setError({message :"Something went wrong"})
            }
            // convert nested structures to get flat list of datasets
            const nestedResp = res.json();
            const flatResp = [];
            Object.entries(nestedResp).forEach(([category, citems]) => {
                Object.entries(citems).forEach(([temporal, titems]) => {
                    Object.keys(titems).forEach(variable => {
                        flatResp.push(titems[variable]);
                    });
                });
            });
            // parse to expected dataset dict
            const parsed = flatResp.map((d) => parseIriDataset(d))
            return parsed

        }).then(data => {
            console.log(data)
            setLoading(false)
            setData(data)

        }).catch(err => {
            console.log(err)
            setError(err)
            setLoading(false)
        })
    }, [dataset,period,features])

    return {data, error, loading}
  
} 

export default useIriDatasets;