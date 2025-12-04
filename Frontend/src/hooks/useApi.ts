/**
 * useApi Hook
 * Custom hook for API calls with loading and error handling
 */

import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiFunc(...args);
                setData(response);
                return response;
            } catch (err) {
                setError(err.message || 'An error occurred');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [apiFunc]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        reset,
    };
};

export default useApi;
