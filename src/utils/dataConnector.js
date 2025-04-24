
export const fetchDataConnectorDatasets = async ({host}) => {

    const url = host + '/datasets';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const datasets = await response.json();
        datasets.map((d) => {
            d.apiUrl = host
        })
        return datasets; // ✅ Assuming API returns an array of datasets
    } catch (err) {
        console.error(`Failed to fetch datasets from ${url}:`, err);
        throw new Error(`Failed to fetch datasets from ${url}`);
    }
};
