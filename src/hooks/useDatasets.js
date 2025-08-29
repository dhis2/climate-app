import { useState, useEffect } from 'react';
import useEarthEngineDatasets from './useEarthEngineDatasets.js';
import useEnactsDatasets from './useEnactsDatasets.js'

const useDatasets = () => {
    console.log('running useDatasets')
  
    // Call all hooks for listing each provider's datasets
    const results = []
    results.push( useEarthEngineDatasets() )
    results.push( useEnactsDatasets() )
    
    // Combine hook results
    const loading = results.some(r => r.loading);
    const errors = results.map(r => r.error).filter(Boolean);
    const allDatasets = results.map(r => r.data || []).flat();
  
    console.log('useDatasets final', allDatasets, loading, errors)
    return { 
        data: allDatasets, 
        loading, 
        error: errors.length > 0 ? errors : null
    };

};

export default useDatasets;