import { useState, useEffect } from 'react'

function useApiStats(props) {
  const [isLoadingApiStats, setIsLoadingApiStats] = useState(true);
  const [apiStats, setApiStats] = useState(null);

  useEffect( () => {
    updateApiStats();
  }, []);

  const updateApiStats = () => {
    fetch( process.env.REACT_APP_API_URL )
    .then(res => res.json())
    .then(json => {
      setApiStats(json);
      setIsLoadingApiStats(false);
    })
    .catch( error => console.log('Error fetching data from api. ', error) )
  }

  return { isLoadingApiStats, apiStats, updateApiStats };
}

export default useApiStats;