import { useEffect } from "react";
import useEarthEngineData from "./useEarthEngineData"
import useEnactsData from "./useEnactsData"

const useImport = (dataset, period, features) => {
  if (dataset?.provider == 'enacts') {
    const {data, error, loading} = useEnactsData(
      dataset,
      period,
      features
    )
    return { data, error, loading };
  } else {
    const { data, error, loading } = useEarthEngineData(
      dataset,
      period,
      features
    );
    return { data, error, loading };
  }
}
export default useImport;