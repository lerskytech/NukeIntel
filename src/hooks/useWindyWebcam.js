import { useQuery } from 'react-query';
import axios from 'axios';

/**
 * Custom hook to fetch webcam data from Windy Webcams API
 * 
 * The hook handles:
 * - API key management via environment variables
 * - Automatic data refreshing before token expiration (tokens expire after 10 minutes)
 * - Error handling for common API issues
 * - Response validation to ensure proper data structure
 * 
 * @param {string} webcamId - ID of the webcam to fetch
 * @returns {Object} - Query result containing webcam data, loading state, and errors
 * @property {boolean} isLoading - True when data is being fetched
 * @property {boolean} isError - True when an error occurred
 * @property {Object} error - Error object if isError is true
 * @property {Object} data - Webcam data if fetch was successful
 */
export const useWindyWebcam = (webcamId) => {
  // API URL and key
  const apiUrl = 'https://webcams.windy.com/webcams/api/v3/webcams';
  const apiKey = import.meta.env.VITE_WINDY_API_KEY;

  const fetchWebcamData = async () => {
    try {
      // Validate inputs
      if (!webcamId) {
        throw new Error('Webcam ID is required');
      }
      
      if (!apiKey) {
        console.error('Windy API key not found in environment variables');
        throw new Error('API key not configured');
      }

      // Make API request
      const response = await axios.get(
        `${apiUrl}?webcamIds=${webcamId}&include=images,player,location`,
        {
          headers: {
            'x-windy-api-key': apiKey
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Validate response
      if (!response.data || !response.data.result || !response.data.result.webcams || response.data.result.webcams.length === 0) {
        throw new Error('No webcam data received or invalid response format');
      }

      // Return the first (and should be only) webcam in the result
      return response.data.result.webcams[0];
    } catch (error) {
      console.error(`Failed to fetch Windy webcam data for ID ${webcamId}:`, error);
      throw error;
    }
  };

  // Use react-query for data fetching with caching
  return useQuery(['windyWebcam', webcamId], fetchWebcamData, {
    refetchOnWindowFocus: false,
    staleTime: 8 * 60 * 1000, // 8 minutes (tokens expire after 10 minutes)
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: (failCount, error) => {
      // Don't retry on 401 (unauthorized) or 404 (not found)
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return false;
      }
      return failCount < 3; // retry up to 3 times for other errors
    },
    enabled: !!webcamId && !!apiKey,
    onError: (error) => {
      console.error(`Error fetching webcam ${webcamId}:`, error);
      // We could implement additional error reporting here if needed
    }
  });
};

/**
 * Custom hook to fetch multiple webcams at once from Windy Webcams API
 * @param {Array<string>} webcamIds - Array of webcam IDs to fetch
 * @returns {Object} - Query result containing array of webcam data
 */
export const useMultipleWindyWebcams = (webcamIds = []) => {
  // API URL and key
  const apiUrl = 'https://webcams.windy.com/webcams/api/v3/webcams';
  const apiKey = import.meta.env.VITE_WINDY_API_KEY;

  const fetchMultipleWebcams = async () => {
    try {
      // Validate inputs
      if (!webcamIds || webcamIds.length === 0) {
        return [];
      }
      
      if (!apiKey) {
        console.error('Windy API key not found in environment variables');
        throw new Error('API key not configured');
      }

      // Join webcam IDs with commas for the API request
      const webcamIdsParam = webcamIds.join(',');

      // Make API request
      const response = await axios.get(
        `${apiUrl}?webcamIds=${webcamIdsParam}&include=images,player,location`,
        {
          headers: {
            'x-windy-api-key': apiKey
          },
          timeout: 15000 // 15 second timeout
        }
      );

      // Validate response
      if (!response.data || !response.data.result || !response.data.result.webcams) {
        throw new Error('No webcam data received or invalid response format');
      }

      return response.data.result.webcams;
    } catch (error) {
      console.error('Failed to fetch multiple Windy webcams:', error);
      throw error;
    }
  };

  // Generate a query key based on the webcam IDs
  const queryKey = ['multipleWindyWebcams', webcamIds.join(',')];

  // Use react-query for data fetching with caching
  return useQuery(queryKey, fetchMultipleWebcams, {
    refetchOnWindowFocus: false,
    staleTime: 8 * 60 * 1000, // 8 minutes (tokens expire after 10 minutes)
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: (failCount, error) => {
      // Don't retry on 401 (unauthorized) or 404 (not found)
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return false;
      }
      return failCount < 3; // retry up to 3 times for other errors
    },
    enabled: webcamIds.length > 0 && !!apiKey,
    onError: (error) => {
      console.error('Error fetching multiple webcams:', error);
      // We could implement additional error reporting here if needed
    }
  });
};
