import { useQuery } from 'react-query';
import axios from 'axios';

// Fallback data in case API call fails
const FALLBACK_DATA = {
  minutesToMidnight: 90, // 90 seconds = 1.5 minutes to midnight
  lastUpdated: '2024-01-24T12:00:00Z',
  statement: 'The Doomsday Clock stands at 90 seconds to midnight, the closest to global catastrophe it has ever been.',
  source: 'Bulletin of the Atomic Scientists',
};

/**
 * Hook to fetch Doomsday Clock data
 * Uses a fallback when API is unavailable
 */
export const useClockData = () => {
  // You would replace this with your actual API endpoint
  const fetchClockData = async () => {
    try {
      // Note: This is a placeholder URL. In production, replace with actual Doomsday Clock API if available
      // If no public API exists, you might consider creating a simple JSON file hosted on your server
      const { data } = await axios.get('https://api.example.com/doomsday-clock');
      return data;
    } catch (error) {
      console.warn('Failed to fetch Doomsday Clock data:', error);
      // Return fallback data if API call fails
      return FALLBACK_DATA;
    }
  };

  return useQuery('clockData', fetchClockData, {
    refetchOnWindowFocus: false,
    staleTime: 3600000, // 1 hour
    cacheTime: 3600000 * 24, // 24 hours
    retry: 2,
    initialData: FALLBACK_DATA,
    onError: (error) => {
      console.error('Error fetching clock data:', error);
    }
  });
};
