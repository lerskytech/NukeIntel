import { useQuery } from 'react-query';
import axios from 'axios';

// Default coordinates if none provided (Washington DC)
const DEFAULT_COORDINATES = {
  lat: 38.9072,
  lon: -77.0369
};

/**
 * Hook to fetch weather forecast data from Windy Point Forecast API
 * @param {Object} options - Configuration options
 * @param {number} options.lat - Latitude (default: Washington DC)
 * @param {number} options.lon - Longitude (default: Washington DC)
 * @param {string} options.model - Weather model to use (default: 'gfs')
 * @param {Array<string>} options.parameters - Weather parameters to fetch
 * @returns {Object} Query result containing weather data and status
 */
export const useWindyPointForecast = (options = {}) => {
  const {
    lat = DEFAULT_COORDINATES.lat,
    lon = DEFAULT_COORDINATES.lon,
    model = 'gfs',
    parameters = ['temp', 'wind', 'pressure'],
    levels = ['surface']
  } = options;

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_WINDY_API_KEY;

  const fetchForecastData = async () => {
    try {
      // Check if API key is available
      if (!apiKey) {
        console.error('Windy API key not found in environment variables');
        throw new Error('API key not configured');
      }

      const response = await axios({
        method: 'post',
        url: 'https://api.windy.com/api/point-forecast/v2',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          lat,
          lon,
          model,
          parameters,
          levels,
          key: apiKey
        },
        timeout: 10000 // 10 second timeout
      });

      if (!response.data) {
        throw new Error('No data received from Windy API');
      }

      // Process and parse the response data
      const processedData = processWeatherData(response.data);
      console.log('Windy forecast data fetched successfully:', processedData);
      return processedData;
    } catch (error) {
      console.error('Failed to fetch Windy forecast data:', error);
      throw error;
    }
  };

  /**
   * Process and format the raw weather data from Windy API
   * @param {Object} data - Raw data from Windy API
   * @returns {Object} Processed weather data
   */
  const processWeatherData = (data) => {
    // If no data or invalid structure, return null
    if (!data || !data.ts || !data.ts.length) {
      return null;
    }

    // Get the current forecast (first time step)
    const currentIndex = 0;
    const timestamp = data.ts[currentIndex];
    
    // Initialize the processed data object
    const processed = {
      timestamp,
      date: new Date(timestamp * 1000).toISOString(),
      location: {
        lat,
        lon
      }
    };

    // Process temperature
    if (data.temp && data.temp.surface && data.temp.surface[currentIndex] !== undefined) {
      // Temperature is in Kelvin, convert to Celsius and Fahrenheit
      const tempKelvin = data.temp.surface[currentIndex];
      const tempCelsius = tempKelvin - 273.15;
      const tempFahrenheit = (tempCelsius * 9/5) + 32;
      
      processed.temperature = {
        celsius: Math.round(tempCelsius * 10) / 10, // Round to 1 decimal place
        fahrenheit: Math.round(tempFahrenheit * 10) / 10,
        kelvin: tempKelvin
      };
    }

    // Process wind
    if (
      data.wind_u && data.wind_u.surface && data.wind_u.surface[currentIndex] !== undefined &&
      data.wind_v && data.wind_v.surface && data.wind_v.surface[currentIndex] !== undefined
    ) {
      const windU = data.wind_u.surface[currentIndex]; // West-East component
      const windV = data.wind_v.surface[currentIndex]; // South-North component
      
      // Calculate wind speed and direction
      const windSpeed = Math.sqrt(windU * windU + windV * windV);
      let windDirection = Math.atan2(windU, windV) * (180 / Math.PI);
      if (windDirection < 0) {
        windDirection += 360;
      }
      
      processed.wind = {
        speed: {
          metersPerSecond: Math.round(windSpeed * 10) / 10,
          kilometersPerHour: Math.round((windSpeed * 3.6) * 10) / 10,
          milesPerHour: Math.round((windSpeed * 2.237) * 10) / 10
        },
        direction: {
          degrees: Math.round(windDirection),
          cardinal: degreesToCardinal(windDirection)
        }
      };
    }

    // Process pressure
    if (data.pressure && data.pressure.surface && data.pressure.surface[currentIndex] !== undefined) {
      const pressurePa = data.pressure.surface[currentIndex];
      processed.pressure = {
        hPa: Math.round(pressurePa / 100),
        inHg: Math.round((pressurePa / 3386.39) * 100) / 100
      };
    }

    return processed;
  };

  /**
   * Convert wind direction in degrees to cardinal direction
   * @param {number} degrees - Wind direction in degrees
   * @returns {string} Cardinal direction
   */
  const degreesToCardinal = (degrees) => {
    const cardinals = [
      'N', 'NNE', 'NE', 'ENE', 
      'E', 'ESE', 'SE', 'SSE', 
      'S', 'SSW', 'SW', 'WSW', 
      'W', 'WNW', 'NW', 'NNW'
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return cardinals[index];
  };

  // Unique query key based on location and parameters
  const queryKey = ['windyForecast', lat, lon, model, parameters.join(',')];

  return useQuery(queryKey, fetchForecastData, {
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 60 minutes
    cacheTime: 60 * 60 * 1000, // 60 minutes
    retry: 2,
    onError: (error) => {
      console.error('Error fetching weather forecast data:', error);
    }
  });
};
