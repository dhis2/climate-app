import { useState, useEffect } from "react";
import useEarthEngineData from "./useEarthEngineData"
const useImportEngine = (dataset, period, features) => {
    const { data, error, loading } = useEarthEngineData(
        dataset,
        period,
        features
      );
      console.log(data)
      console.log(error)
      console.log(loading)    
        return { data, error, loading };
}
export default useImportEngine;