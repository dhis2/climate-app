import { useEffect } from "react";
import useEarthEngineData from "./useEarthEngineData"
import useIriData from "./useIriData"

const useImport = (dataset, period, features) => {
  if (dataset?.provider == 'iri') {
    const {data, error, loading} = useIriData(
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