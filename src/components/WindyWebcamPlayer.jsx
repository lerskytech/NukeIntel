import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaShareAlt, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import { useWindyWebcam } from '../hooks/useWindyWebcam';
import windyLogo from '../assets/windy-logo.svg';

/**
 * WindyWebcamPlayer - Component to display a single Windy webcam with player
 * @param {Object} props - Component props
 * @param {string} props.webcamId - ID of the Windy webcam to display
 * @param {string} props.label - Label for the webcam
 * @param {string} props.city - City name for the webcam
 * @param {boolean} props.highAlert - Whether this is a high alert webcam
 * @param {string} props.shareId - ID used for sharing
 */
const WindyWebcamPlayer = ({ webcamId, label, city, highAlert = false, shareId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Fetch webcam data from Windy API
  const { data: webcamData, isLoading, error } = useWindyWebcam(webcamId);
  
  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      console.error(`Error loading webcam ${webcamId} (${city} - ${label}):`, error);
      
      // Specific error information
      if (error.response) {
        console.error(`Status: ${error.response.status}, Data:`, error.response.data);
      }
    }
  }, [error, webcamId, city, label]);
  
  // Handle share functionality
  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}?webcam=${shareId}`;
    
    if (navigator.share) {
      navigator.share({
        title: `NukeIntel - ${city} ${label} Webcam`,
        text: `Check out this live webcam from ${city} (${label})`,
        url: shareUrl
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          // Using a more subtle notification instead of alert
          const notification = document.createElement('div');
          notification.textContent = 'Link copied to clipboard!';
          notification.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background-color:rgba(59,130,246,0.9); color:white; padding:10px 20px; border-radius:4px; z-index:1000;';
          document.body.appendChild(notification);
          
          // Remove after 3 seconds
          setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => document.body.removeChild(notification), 500);
          }, 3000);
        })
        .catch(err => {
          console.error('Failed to copy link:', err);
        });
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-blue-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-blue-500">Loading webcam...</p>
        </div>
      </div>
    );
  }

  // Render error state with specific error messages
  if (error || !webcamData) {
    // Determine the specific error type
    const errorType = error?.response?.status;
    let errorTitle = 'Webcam Unavailable';
    let errorMessage = 'Unable to load webcam data';
    
    // Specific error messages based on status code
    if (errorType === 401) {
      errorTitle = 'Authentication Error';
      errorMessage = 'API key invalid or expired';
    } else if (errorType === 404) {
      errorTitle = 'Webcam Not Found';
      errorMessage = 'The webcam may no longer be available';
    } else if (errorType === 429) {
      errorTitle = 'Rate Limit Exceeded';
      errorMessage = 'Too many requests, please try again later';
    } else if (error?.message?.includes('timeout')) {
      errorTitle = 'Connection Timeout';
      errorMessage = 'The request took too long to complete';
    }
    
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-red-500">
        <div className="text-center p-4">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-2" />
          <h3 className="text-red-500 font-bold">{errorTitle}</h3>
          <p className="text-gray-400 text-sm">{errorMessage}</p>
          {errorType === 401 && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          )}
        </div>
      </div>
    );
  }

  // Extract webcam details from the API response
  const { player, title, location, image } = webcamData;
  const thumbnailUrl = image?.current?.thumbnail || image?.daylight?.thumbnail;
  const embedUrl = player?.day?.embed;

  return (
    <motion.div 
      className={`relative w-full overflow-hidden rounded-lg ${highAlert ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* High alert indicator */}
      {highAlert && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 bg-opacity-90 text-white text-xs font-bold py-1 px-2 flex items-center z-10">
          <FaExclamationTriangle className="mr-1" />
          HIGH ALERT FEED
        </div>
      )}

      {/* Webcam player */}
      <div className="relative w-full aspect-video">
        {isPlaying ? (
          <iframe 
            src={embedUrl}
            title={title}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        ) : (
          // Thumbnail with play button overlay
          <div 
            className="relative w-full h-full bg-gray-900 cursor-pointer group"
            onClick={() => setIsPlaying(true)}
          >
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all">
              <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transform transition-transform group-hover:scale-110">
                <FaPlay className="text-xl" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Webcam info */}
      <div className="bg-gray-900 px-3 py-2 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold text-sm">{city} - {label}</h3>
            <p className="text-gray-400 text-xs">{location?.city}, {location?.country}</p>
          </div>
          <button 
            onClick={handleShareClick}
            className="text-blue-400 hover:text-blue-300 p-1"
            aria-label="Share webcam"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>

      {/* Windy attribution */}
      <a 
        href={`https://www.windy.com/webcams/${webcamId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 opacity-70 hover:opacity-100 transition-opacity z-10 flex items-center"
      >
        <span className="text-xs text-white mr-1 bg-black bg-opacity-60 px-1 rounded">Powered by</span>
        <img src={windyLogo} alt="Windy.com" className="h-4" />
      </a>
    </motion.div>
  );
};

export default WindyWebcamPlayer;
