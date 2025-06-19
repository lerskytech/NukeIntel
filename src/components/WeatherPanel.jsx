import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { webcamSources } from '../data/webcamSources';
import WeatherWidget from './WeatherWidget';

/**
 * Weather Panel component that displays weather information for geopolitical locations
 * Integrates with the same location data used by webcam feeds
 */
const WeatherPanel = () => {
  // Filter out reference locations that shouldn't be shown in UI
  const displayableLocations = webcamSources.filter(source => !source.isReference);
  
  // State for currently selected location
  const [selectedLocation, setSelectedLocation] = useState(displayableLocations[0]);
  
  // Parse coordinates from string format to numeric values
  const parseCoordinates = (coordString) => {
    try {
      // Extract numeric values and direction (N/S/E/W) from the coordinate string
      const latMatch = coordString.match(/(\d+\.\d+)°\s*([NS])/);
      const lonMatch = coordString.match(/(\d+\.\d+)°\s*([EW])/);
      
      if (!latMatch || !lonMatch) return null;
      
      // Convert to numeric values
      let lat = parseFloat(latMatch[1]);
      lat = latMatch[2] === 'S' ? -lat : lat;
      
      let lon = parseFloat(lonMatch[1]);
      lon = lonMatch[2] === 'W' ? -lon : lon;
      
      return { lat, lon };
    } catch (error) {
      console.error('Failed to parse coordinates:', error);
      return null;
    }
  };
  
  // Get coordinates for the selected location
  const coordinates = parseCoordinates(selectedLocation?.coordinates);
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gray-900 border border-blue-500 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-4 border-b border-blue-500">
        <h2 className="text-xl font-bold text-blue-400 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 16a3.5 3.5 0 01-1.41-6.73a4 4 0 017.25-3.25a4.002 4.002 0 013.16 6.48A3.5 3.5 0 015.5 16z" />
          </svg>
          Global Weather Monitor
        </h2>
      </div>
      
      <div className="p-4">
        {/* Location Selection Tabs */}
        <div className="mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
          <div className="flex space-x-2 pb-2">
            {displayableLocations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`px-3 py-1.5 text-sm rounded whitespace-nowrap transition-colors duration-200 ${
                  selectedLocation.id === location.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {location.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* Weather Widget */}
        <div className="mb-4">
          {coordinates ? (
            <WeatherWidget 
              lat={coordinates.lat}
              lon={coordinates.lon}
              locationName={selectedLocation.location}
              showFahrenheit={false}
            />
          ) : (
            <div className="bg-gray-900 border border-yellow-500 rounded-lg p-4 text-center">
              <p className="text-yellow-500">Unable to load coordinates for this location.</p>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-2 text-center">
          <p>Select a location to view current weather conditions.</p>
          <p>Weather data updates hourly.</p>
        </div>
      </div>
    </motion.section>
  );
};

export default WeatherPanel;
