import { useState, useEffect } from 'react';
import datasets from '../data/datasets.js'; // ✅ Hardcoded datasets
import { fetchDataConnectorDatasets } from '../utils/dataConnector.js';

/**
 * Fetches hardcoded datasets and merges them with datasets fetched from multiple APIs.
 * @param {Array} hosts - An array of data connector host urls.
 * @returns {Object} { datasets, loading, error }
 */
const useDatasets = () => {
    const [allDatasets, setAllDatasets] = useState(datasets); // ✅ Start with hardcoded datasets
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hosts = ['http://localhost:7000'];

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                setLoading(true);
                setError(null);

                // ✅ Fetch all datasets from multiple API sources
                const fetchPromises = hosts.map(async (host) => {
                    try {
                        console.log('host', host)
                        const hostDatasets = fetchDataConnectorDatasets({host});
                        return hostDatasets;
                    } catch (err) {
                        console.error(`Failed to fetch datasets from ${host}:`, err);
                        return []; // Return empty array if fetch fails for a specific source
                    }
                });

                const fetchedDatasetsArray = await Promise.all(fetchPromises);

                // ✅ Flatten the results (since we get an array of arrays)
                const fetchedDatasets = fetchedDatasetsArray.flat();

                console.log('Fetched datasets:', fetchedDatasets);

                // ✅ Merge hardcoded and fetched datasets (remove duplicates)
                const mergedDatasets = [...datasets, ...fetchedDatasets];

                // ✅ Deduplicate datasets by ID
                const uniqueDatasets = mergedDatasets.filter((d, index, self) =>
                    index === self.findIndex((t) => t.id === d.id)
                );

                setAllDatasets(uniqueDatasets);
            } catch (err) {
                console.error('Error fetching datasets:', err);
                setError('Failed to load additional datasets.');
            } finally {
                setLoading(false);
            }
        };

        fetchDatasets();
    }, []);

    return { datasets: allDatasets, loading, error };
};

export default useDatasets;
