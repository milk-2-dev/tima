// hooks/useSupabaseQuery.js
import { useState, useCallback } from 'react';
import { formatSupabaseError } from '../utils/errorHandling';

export const useSupabaseQuery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const executeQuery = useCallback(async (queryFn) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await queryFn();
      setData(result);
      return { data: result, error: null };
    } catch (err) {
      const formattedError = formatSupabaseError(err);
      setError(formattedError);
      return { data: null, error: formattedError };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { 
    loading, 
    error, 
    data, 
    executeQuery, 
    reset,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && error !== null
  };
};