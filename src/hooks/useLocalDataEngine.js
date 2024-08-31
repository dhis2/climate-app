import { useState, useEffect } from "react";

const useLocalDataEngine = (dataset, period, features) =>{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState();
    
    useEffect(()=>{
        let ids = []
        features?.map(fet => ids.push(fet.id))
        if(ids.length > 0){
        fetch('http://localhost:3000/import_daily',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                org_unit : ids,
                start_date : period.startTime,
                end_date : period.endTime,
                variable_name : dataset.tag
            })        
        }).then(res => {
            if(res.status == 400){
                setLoading(false)
                setError({message :"Something went wrong"})
            }
            return res.json()
            
        }).then(data =>{
            console.log(data)
            setLoading(false)
            setData(data)
        } ).catch(err =>{
            console.log(err)
            setError(err)
            setLoading(false) 
        })
    }

    },[dataset,period,features])

    return {data, error, loading}
  
} 

export default useLocalDataEngine;