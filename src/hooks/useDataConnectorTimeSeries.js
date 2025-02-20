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
        {'id': '2025-02', 'forecast_precipitation_sum': 0.18},
        {'id': '2025-03', 'forecast_precipitation_sum': 0.33},
        {'id': '2025-04', 'forecast_precipitation_sum': 0.5},
        {'id': '2025-05', 'forecast_precipitation_sum': 0.88}
    ]
    */
    console.log('Raw results', responseData)
    const parsedData = responseData.result.map((item) => ({
        id: item.year_month, //.replace('2024', '2025'), // TEMP HACK!!!  
        forecast_precipitation_sum: item.value, // key is hardcoded for now, needs to be more generic
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

const getCacheKey = ({ host, dataset, periodType, periodStart, periodEnd, orgunits }) =>
    JSON.stringify({ host, dataset, periodType, periodStart, periodEnd, orgunits });
  
const useDataConnectorTimeSeries = ({
    host,
    dataset,
    periodType,
    periodStart,
    periodEnd,
    orgunits,
  }) => {
    const [data, setData] = useState();
  
    useEffect(() => {
      let canceled = false;
  
      if (dataset && periodType && orgunits) {
        const key = getCacheKey({ host, dataset, periodType, periodStart, periodEnd, orgunits });
  
        if (cachedPromise[key]) {
          // ✅ Use cached promise if available
          cachedPromise[key].then((data) => {
            if (!canceled) {
              console.log('Using cached data', data);
              setData(data);
            }
          });
  
          return () => {
            canceled = true;
          };
        }
  
        setData(); // Reset before fetching new data
        // ✅ Fetch new data and store the promise in cache
        cachedPromise[key] = dataConnectorRequest({
          host,
          dataset,
          periodType,
          periodStart,
          periodEnd,
          orgunits,
        })
        .then((response) => response.json())
        .then((jsonData) => parseResults(jsonData));
  
        cachedPromise[key].then((data) => {
          if (!canceled) {
            console.log('Fetched new data', data);
            setData(data);
          }
        });
  
        return () => {
          canceled = true;
        };
      }
    }, [host, dataset, periodType, periodStart, periodEnd, orgunits]);
  
    return data;
  };

export default useDataConnectorTimeSeries
