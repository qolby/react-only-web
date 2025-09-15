import { useState, useEffect } from 'react';

// custom hook must start with 'use' to make it work
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Could not fetch the data for that resource');
      }
      const data = await response.json();
      setData(data);
      setIsPending(false);
      setError(null);
    } catch (error) {
      setIsPending(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    isPending,
    error,
    refetch,
  };
};

export default useFetch;
