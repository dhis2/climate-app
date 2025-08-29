import { useState, useEffect } from 'react';
import datasets from '../data/datasets.js'; // ✅ Hardcoded datasets
import useEnactsDatasets from './useEnactsDatasets.js'

const useDatasets = () => {
    console.log('running useDatasets')
    const staticDatasets = datasets;
  
    // Call all custom hooks at the top level
    const results = []
    results.push( useEnactsDatasets() )
    
    // Combine hook results
    const loading = results.some(r => r.loading);
    const errors = results.map(r => r.error).filter(Boolean);
    const dynamicDatasets = results.map(r => r.data || []).flat();
  
    const allDatasets = [...staticDatasets, ...dynamicDatasets];
  
    console.log('useDatasets final', allDatasets, loading, errors)
    return { 
        data: allDatasets, 
        loading, 
        error: errors.length > 0 ? errors : null
    };

};

export default useDatasets;