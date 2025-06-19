import React, { useState } from 'react';
import { useWindyPointForecast } from '../hooks/useWindyPointForecast';
import { FaTemperatureHigh, FaWind, FaTachometerAlt, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiFog } from 'react-icons/wi';
import { motion } from 'framer-motion';
import windyLogo from '../assets/windy-logo.svg'; // You'll need to add this SVG

/**
 * Weather widget component that displays forecast data from Windy API
 * @param {Object} props - Component props
 * @param {number} props.lat - Latitude for forecast
 * @param {number} props.lon - Longitude for forecast
 * @param {string} props.locationName - Name of the location
 * @param {boolean} props.showFahrenheit - Whether to show temps in Fahrenheit (default: false)
 */
const WeatherWidget = ({ lat, lon, locationName = 'Current Location', showFahrenheit = false }) => {
  const [temperatureUnit, setTemperatureUnit] = useState(showFahrenheit ? 'F' : 'C');
  
  // Fetch weather data using our custom hook
  const { 
    data: weatherData, 
    isLoading, 
    isError,
    error,
    refetch
  } = useWindyPointForecast({ lat, lon });
  
  // Toggle between Celsius and Fahrenheit
  const toggleTemperatureUnit = () => {
    setTemperatureUnit(temperatureUnit === 'C' ? 'F' : 'C');
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-blue-500 rounded-lg p-4 shadow-lg w-full max-w-sm mx-auto">
        <div className="animate-pulse flex flex-col space-y-3">
          <div className="h-6 bg-gray-800 rounded w-3/4"></div>
          <div className="h-10 bg-gray-800 rounded w-1/2 mx-auto"></div>
          <div className="flex space-x-2 justify-center">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-800 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (isError || !weatherData) {
    return (
      <div className="bg-gray-900 border border-red-500 rounded-lg p-4 shadow-lg w-full max-w-sm mx-auto text-white">
        <div className="flex flex-col items-center">
          <FaExclamationTriangle className="text-red-500 text-3xl mb-2" />
          <h3 className="text-lg font-semibold mb-2">Weather data unavailable</h3>
          <p className="text-sm text-gray-400 mb-3">
            {error?.message || 'Unable to retrieve weather information'}
          </p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
          >
            Try again
          </button>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Contains data from the Windy database</p>
        </div>
      </div>
    );
  }
  
  // Determine which temperature to display based on user preference
  const temperature = temperatureUnit === 'C' 
    ? weatherData.temperature?.celsius 
    : weatherData.temperature?.fahrenheit;
  
  // Select appropriate weather icon (this is simplified as Windy API doesn't directly return weather conditions)
  // In a production app, you would determine this from temperature, pressure, and other factors
  const WeatherIcon = WiDaySunny; // Default to sunny, would be determined by actual conditions
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 border border-blue-500 rounded-lg p-4 shadow-lg w-full max-w-sm mx-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{locationName}</h3>
        <button 
          onClick={toggleTemperatureUnit}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded transition duration-200"
        >
          °{temperatureUnit} ⇄ °{temperatureUnit === 'C' ? 'F' : 'C'}
        </button>
      </div>
      
      {/* Main temperature display */}
      <div className="flex items-center justify-center my-3">
        <WeatherIcon className="text-yellow-400 text-5xl mr-3" />
        <div className="text-4xl font-bold text-white">
          {temperature !== undefined ? temperature : '--'}<span className="text-2xl">°{temperatureUnit}</span>
        </div>
      </div>
      
      {/* Weather details grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-800 p-2 rounded flex flex-col items-center">
          <FaTemperatureHigh className="text-red-500 mb-1" />
          <span className="text-xs text-gray-400">Temp</span>
          <span className="text-white text-sm">{temperature !== undefined ? temperature : '--'}°{temperatureUnit}</span>
        </div>
        <div className="bg-gray-800 p-2 rounded flex flex-col items-center">
          <FaWind className="text-blue-400 mb-1" />
          <span className="text-xs text-gray-400">Wind</span>
          <span className="text-white text-sm">
            {weatherData.wind ? `${weatherData.wind.speed.milesPerHour} mph` : '--'}
          </span>
          <span className="text-xs text-gray-400">
            {weatherData.wind ? weatherData.wind.direction.cardinal : '--'}
          </span>
        </div>
        <div className="bg-gray-800 p-2 rounded flex flex-col items-center">
          <FaTachometerAlt className="text-green-400 mb-1" />
          <span className="text-xs text-gray-400">Pressure</span>
          <span className="text-white text-sm">
            {weatherData.pressure ? `${weatherData.pressure.hPa} hPa` : '--'}
          </span>
        </div>
      </div>
      
      {/* Update time and attribution */}
      <div className="mt-2 border-t border-gray-800 pt-2 flex justify-between items-center text-xs text-gray-500">
        <div>
          <p>Updated: {new Date(weatherData?.date).toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center">
          <span className="mr-1">Powered by</span>
          <a 
            href="https://www.windy.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-400 hover:text-blue-300"
          >
            <img src={windyLogo} alt="Windy" className="h-4 mr-1" /> Windy
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
