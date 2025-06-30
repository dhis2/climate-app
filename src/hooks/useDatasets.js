import { useState, useEffect } from 'react';
import datasets from '../data/datasets.js'; // ✅ Hardcoded datasets
import useIriDatasets from '../hooks/useIriDatasets.js'

/**
 * Fetches hardcoded datasets and merges them with datasets fetched from multiple APIs.
 * @returns {Object} { datasets, loading, error }
 */
/*
const useDatasets = () => {
    const [allDatasets, setAllDatasets] = useState(datasets); // ✅ Start with hardcoded datasets
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const datasetHooks = [useIriDatasets];

    useEffect(() => {
        const useMergedDatasets = async () => {
            try {
                // trigger the hooks
                const results = datasetHooks.map(hook => hook());
            
                // set loading
                //const loading = results.some(r => r.loading);
            
                // get and merge datasets
                const fetchedDatasets = results
                    .map(r => r.data || [])   // handle undefined
                    .flat();                  // flatten arrays into one
                const mergedDatasets = [...datasets, ...fetchedDatasets];
                setAllDatasets(mergedDatasets)

                // collect any errors
                const errors = results
                    .map(r => r.error)
                    .filter(Boolean); // removes undefined/null
                console.error('Error fetching additional datasets from one or more local data providers:', errors)
                setError('Error fetching additional datasets from one or more local data providers')

            } catch (err) {
                // unexpected error
                console.error('Unknown error while loading local datasets:', err);
                setError('Unknown error while loading local datasets.');

            } finally {
                // finished
                setLoading(false);
            }
        }
        useMergedDatasets();
    }, []);

    return { datasets: allDatasets, loading, error };
};
*/

const useDatasets = () => {
    const staticDatasets = datasets;
  
    // ✅ Call all custom hooks at the top level
    const results = []
    results.push( useIriDatasets() )
    
    // 🔄 Combine hook results
    const loading = results.some(r => r.loading);
    const errors = results.map(r => r.error).filter(Boolean);
    const dynamicDatasets = results.map(r => r.data || []).flat();
  
    const allDatasets = [...staticDatasets, ...dynamicDatasets];
    const error =
      errors.length > 0
        ? 'Error fetching additional datasets from one or more local data providers'
        : null;
  
    return { data: allDatasets, loading, error };
  };

export default useDatasets;