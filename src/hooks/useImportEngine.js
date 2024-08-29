import useEarthEngineData from "./useEarthEngineData"
const useImportEngine = (dataset, period, features) => {
  console.log(dataset)   
   const { data, error, loading } = useEarthEngineData(
        dataset,
        period,
        features
      );
          console.log(data)
        return { data, error, loading };
}
export default useImportEngine;