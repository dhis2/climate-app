import { useEffect } from "react";
import useEarthEngineData from "./useEarthEngineData"
import useLocalDataEngine from "./useLocalDataengine"

const useImportEngine = (dataset, period, features) => {
  useEffect(()=>{
    //do something
  },[features])
  if(dataset?.tag != undefined){
    const {data, error, loading} = useLocalDataEngine(
      dataset,
      period,
      features
    )
    return { data, error, loading };
  }else{
    const { data, error, loading } = useEarthEngineData(
         dataset,
         period,
         features
       );
       return { data, error, loading };
  }
}
export default useImportEngine;