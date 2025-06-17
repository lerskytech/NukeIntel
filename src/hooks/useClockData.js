import { useQuery } from 'react-query';
import axios from 'axios';

// Accurate Doomsday Clock data as of the latest official update
// Source: https://thebulletin.org/doomsday-clock/
const CURRENT_CLOCK_DATA = {
  minutesToMidnight: 90, // 90 seconds to midnight (official as of Jan 24, 2024)
  lastUpdated: '2024-01-24T15:00:00Z',
  statement: 'The Doomsday Clock stands at 90 seconds to midnight, the closest to global catastrophe it has ever been.',
  source: 'Bulletin of the Atomic Scientists',
  url: 'https://thebulletin.org/doomsday-clock/',
  history: [
    { year: 2024, minutesToMidnight: 90, date: '2024-01-24' },
    { year: 2023, minutesToMidnight: 90, date: '2023-01-24' },
    { year: 2022, minutesToMidnight: 100, date: '2022-01-20' },
    { year: 2021, minutesToMidnight: 100, date: '2021-01-27' },
    { year: 2020, minutesToMidnight: 100, date: '2020-01-23' },
    { year: 2019, minutesToMidnight: 120, date: '2019-01-24' },
    { year: 2018, minutesToMidnight: 120, date: '2018-01-25' },
    { year: 2017, minutesToMidnight: 150, date: '2017-01-26' },
  ]
};

/**
 * Hook to fetch Doomsday Clock data
 * First attempts to scrape the Bulletin's website for up-to-date information
 * Falls back to the last known accurate data if that fails
 */
export const useClockData = () => {
  const fetchClockData = async () => {
    try {
      // Try to fetch from Bulletin's official RSS feed or news API if available
      // This is a starting point - in production, you might use a more reliable method
      const response = await axios.get('https://thebulletin.org/feed/', {
        timeout: 5000 // 5 second timeout
      });
      
      // Parse the XML to look for clock updates
      // This is a simplified example - actual implementation would need to parse the RSS and look for Doomsday Clock announcements
      const clockUpdatePost = response.data.includes('Doomsday Clock') && response.data.includes('minutes to midnight');
      
      if (clockUpdatePost) {
        // If we found an update, we would parse it here
        // For now, just use our accurate hardcoded data
        console.log('Found potential clock update, validation needed');
      }
      
      // Always return the most accurate data we have
      return CURRENT_CLOCK_DATA;
    } catch (error) {
      console.warn('Failed to check for Doomsday Clock updates:', error);
      // Return our accurate data if API call fails
      return CURRENT_CLOCK_DATA;
    }
  };

  return useQuery('clockData', fetchClockData, {
    refetchOnWindowFocus: false,
    staleTime: 3600000, // 1 hour
    cacheTime: 3600000 * 24, // 24 hours
    retry: 2,
    initialData: CURRENT_CLOCK_DATA,
    onError: (error) => {
      console.error('Error fetching clock data:', error);
    }
  });
};
