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
 * Uses the official Bulletin of Atomic Scientists website information
 * Falls back to the last known accurate data if fetching fails
 */
export const useClockData = () => {
  const fetchClockData = async () => {
    try {
      // First, try to fetch the current clock data from the Bulletin's API endpoint
      // Note: This uses the Bulletin's open graph data as a proxy for their official statement
      const response = await axios.get('https://thebulletin.org/doomsday-clock/', {
        timeout: 8000 // 8 second timeout
      });
      
      if (response.data) {
        try {
          // Extract the current time from the page content
          const clockRegex = /([0-9]+)\s*(?:seconds|minutes)\s*to\s*midnight/i;
          const match = response.data.match(clockRegex);
          
          if (match) {
            const timeValue = parseInt(match[1], 10);
            const isSeconds = response.data.toLowerCase().includes('seconds to midnight');
            const minutesToMidnight = isSeconds ? timeValue / 60 : timeValue;
            const secondsToMidnight = isSeconds ? timeValue : timeValue * 60;
            
            // Extract statement if available
            let statement = 'The Doomsday Clock stands at 90 seconds to midnight, the closest to global catastrophe it has ever been.';
            const statementRegex = /<meta\s+property="og:description"\s+content="([^"]+)"/i;
            const statementMatch = response.data.match(statementRegex);
            
            if (statementMatch && statementMatch[1]) {
              statement = statementMatch[1].replace(/&quot;/g, '"');
            }
            
            console.log('Successfully parsed Doomsday Clock data:', { secondsToMidnight, statement });
            
            return {
              ...CURRENT_CLOCK_DATA,
              minutesToMidnight: minutesToMidnight,
              secondsToMidnight: secondsToMidnight,
              statement: statement,
              lastUpdated: new Date().toISOString(),
              fetchedLive: true
            };
          }
        } catch (parseError) {
          console.warn('Error parsing clock data:', parseError);
        }
      }
      
      // If we couldn't extract the clock time or statement, use our accurate fallback data
      return CURRENT_CLOCK_DATA;
    } catch (error) {
      console.warn('Failed to fetch Doomsday Clock updates:', error);
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
