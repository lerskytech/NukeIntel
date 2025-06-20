import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import { windyWebcams } from '../data/windyWebcams';
import { useMultipleWindyWebcams } from '../hooks/useWindyWebcam';
import WindyWebcamPlayer from './WindyWebcamPlayer';

/**
 * HighAlertFeed Component
 * Displays a grid or carousel of high alert Windy webcams from critical global locations
 */
const HighAlertFeed = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const webcamIds = windyWebcams.map(webcam => webcam.id);
  
  // Fetch all webcam data in a single request with query options
  const { data: webcamsData, isLoading, error, refetch } = useMultipleWindyWebcams(webcamIds);
  
  // Setup periodic refresh to prevent token expiration
  // Windy tokens expire after 10 minutes, we'll refresh every 8 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log('Refreshing webcam data to prevent token expiration');
      refetch();
    }, 8 * 60 * 1000); // 8 minutes
    
    return () => clearInterval(refreshInterval);
  }, [refetch]);
  
  // Handle manual refresh
  const handleManualRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
  
  // Calculate items per row based on screen size
  const getItemsPerRow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 5;  // xl
      if (window.innerWidth >= 1024) return 4;  // lg
      if (window.innerWidth >= 768) return 3;   // md
      if (window.innerWidth >= 640) return 2;   // sm
      return 1; // xs
    }
    return 2; // Default for server-side rendering
  };
  
  // Handle navigation in carousel mode
  const handleNavigation = (direction) => {
    if (direction === 'prev') {
      setActiveIndex(prev => (prev === 0 ? windyWebcams.length - 1 : prev - 1));
    } else {
      setActiveIndex(prev => (prev === windyWebcams.length - 1 ? 0 : prev + 1));
    }
  };
  
  // Toggle between grid and carousel view
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'carousel' : 'grid');
    setActiveIndex(0); // Reset to first item when switching views
  };
  
  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`w-full ${expanded ? 'fixed inset-0 z-50 bg-gray-900 p-4 overflow-auto' : ''}`}
    >
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-500 flex items-center">
            <FaExclamationTriangle className="mr-2" /> 
            High Alert Feeds
          </h2>
          <p className="text-gray-300 text-sm">Real-time Windy webcams from critical locations</p>
        </div>
        
        <div className="flex space-x-2">
          {/* View mode toggle */}
          <button 
            onClick={toggleViewMode} 
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm"
            aria-label={`Switch to ${viewMode === 'grid' ? 'carousel' : 'grid'} view`}
          >
            {viewMode === 'grid' ? 'Carousel View' : 'Grid View'}
          </button>
          
          {/* Expand/collapse toggle */}
          <button 
            onClick={toggleExpanded} 
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded"
            aria-label={expanded ? 'Collapse view' : 'Expand view'}
          >
            <FaExpand />
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center p-10 bg-gray-900 rounded-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="ml-3 text-gray-300">Loading high alert feeds...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="p-4 border border-red-500 rounded-lg bg-gray-900 bg-opacity-50">
          <div className="flex items-center justify-center p-10 bg-gray-900 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="text-red-500 mb-2">
                <FaExclamationTriangle size={40} />
              </div>
              <div className="text-center">
                <h3 className="text-xl text-red-500 mb-1">
                  {error?.response?.status === 401 ? 'API Key Error' :
                   error?.response?.status === 429 ? 'Rate Limit Exceeded' :
                   error?.message?.includes('timeout') ? 'Connection Timeout' :
                   error?.message?.includes('Network') ? 'Network Error' :
                   'Error Loading Webcams'}
                </h3>
              </div>
              <button 
                onClick={() => refetch()}
                className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                aria-label="Retry loading webcams"
              >
                <span className="mr-1">Retry</span>
                <FaExclamationTriangle />
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              {error?.response?.status === 401 ? 'Windy API key invalid or expired' :
               error?.response?.status === 429 ? 'Too many requests to Windy API, please try again later' :
               error?.message?.includes('timeout') ? 'The request to Windy API took too long to complete' :
               error?.message?.includes('Network') ? 'Check your internet connection and try again' :
               'Unable to load high alert webcam feeds'}
            </p>
          </div>
        </div>
      )}
      
      {/* Grid View */}
      {viewMode === 'grid' && !isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {windyWebcams.map(webcam => {
            const webcamData = webcamsData?.find(data => data.webcamId === webcam.id);
            const isWebcamUnavailable = !webcamData || webcamData.error;
            
            return (
              <div key={webcam.id} className="relative">
                {isWebcamUnavailable ? (
                  <div className="bg-black border border-red-800 rounded-lg p-4 h-full min-h-[200px] flex flex-col items-center justify-center text-center">
                    <div className="text-red-500 mb-2">
                      <FaExclamationTriangle size={24} />
                    </div>
                    <h3 className="text-red-500 font-bold mb-1">Webcam Unavailable</h3>
                    <div className="text-xs text-gray-400 mb-2">{webcam.city} - {webcam.label}</div>
                    <p className="text-sm text-gray-500">Feed unavailable. Monitoring for updates.</p>
                  </div>
                ) : (
                  <WindyWebcamPlayer
                    webcamId={webcam.id}
                    city={webcam.city}
                    label={webcam.label}
                    highAlert
                    shareId={webcam.shareId}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Carousel View */}
      {viewMode === 'carousel' && !isLoading && !error && (
        <div className="relative">
          {/* Navigation arrows */}
          <button 
            onClick={() => handleNavigation('prev')} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full z-10"
            aria-label="Previous webcam"
          >
            <FaChevronLeft className="text-white" />
          </button>
          
          <button 
            onClick={() => handleNavigation('next')} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full z-10"
            aria-label="Next webcam"
          >
            <FaChevronRight className="text-white" />
          </button>
          
          {/* Active webcam */}
          <motion.div
            key={`carousel-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl mx-auto"
          >
            {(() => {
              const webcam = windyWebcams[activeIndex];
              const webcamData = webcamsData?.find(data => data.webcamId === webcam.id);
              const isWebcamUnavailable = !webcamData || webcamData.error;
              
              if (isWebcamUnavailable) {
                return (
                  <div className="bg-black border border-red-800 rounded-lg p-4 h-full min-h-[300px] flex flex-col items-center justify-center text-center">
                    <div className="text-red-500 mb-2">
                      <FaExclamationTriangle size={32} />
                    </div>
                    <h3 className="text-red-500 font-bold text-xl mb-1">Webcam Unavailable</h3>
                    <div className="text-sm text-gray-400 mb-2">{webcam.city} - {webcam.label}</div>
                    <p className="text-gray-500">Feed unavailable. Monitoring for updates.</p>
                  </div>
                );
              } else {
                return (
                  <WindyWebcamPlayer
                    webcamId={webcam.id}
                    city={webcam.city}
                    label={webcam.label}
                    highAlert
                    shareId={webcam.shareId}
                  />
                );
              }
            })()}
          </motion.div>
          
          {/* Carousel indicator dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {windyWebcams.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full ${activeIndex === index ? 'bg-red-500' : 'bg-gray-600'}`}
                aria-label={`Go to webcam ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Information footer */}
      <div className="mt-4 text-xs text-gray-500">
        <p>All high alert webcams are provided by Windy.com and update in real-time. Click the share button on any feed for a direct link.</p>
      </div>
    </motion.section>
  );
};

export default HighAlertFeed;
