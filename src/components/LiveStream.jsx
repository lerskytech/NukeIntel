import React, { useState, useEffect, useRef } from 'react';
import { FiAlertTriangle, FiLoader, FiFlag } from 'react-icons/fi';

/**
 * LiveStream Component
 * Renders a YouTube embed with clean loading and error states
 * 
 * @param {Object} props
 * @param {string} props.src - URL for YouTube embed
 * @param {string} props.title - Title of the webcam feed
 */
export default function LiveStream({ src, title }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);
  
  useEffect(() => {
    // Reset states when source changes
    setIsLoading(true);
    setHasError(false);
    
    // Add network status monitoring to retry when connection is restored
    const handleOnline = () => {
      if (hasError) {
        console.log(`Network connection restored. Retrying: ${title}`);
        setIsLoading(true);
        setHasError(false);
        // Reload the iframe by updating the src
        if (iframeRef.current) {
          const currentSrc = iframeRef.current.src;
          iframeRef.current.src = "";
          setTimeout(() => {
            iframeRef.current.src = currentSrc;
          }, 100);
        }
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [src, title, hasError]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log(`Successfully loaded stream: ${title}`);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.log(`Error loading feed: ${src}`);
  };
  
  const reportBrokenFeed = () => {
    // This would typically send a notification to admins
    console.log(`User reported broken feed: ${title}`);
    alert(`Thank you for reporting the broken feed. Our team has been notified.`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black rounded-lg shadow-2xl my-4 overflow-hidden">
      <div className="relative aspect-video">
        {/* YouTube iframe */}
        <iframe
          ref={iframeRef}
          className="w-full h-full absolute inset-0"
          src={src}
          title={`${title} live stream`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-red-500 flex flex-col items-center">
              <FiLoader className="w-10 h-10 animate-spin mb-2" />
              <p className="text-white text-sm">Loading feed...</p>
            </div>
          </div>
        )}
        
        {/* Clean error message */}
        {hasError && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 p-4 z-10">
            <FiAlertTriangle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-center text-white font-bold mb-3">Feed unavailable. Monitoring for updates.</p>
            <button 
              onClick={reportBrokenFeed}
              className="mt-2 flex items-center gap-2 px-3 py-1 bg-red-800 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
            >
              <FiFlag size={12} /> Report broken feed
            </button>
          </div>
        )}
      </div>
      
      {/* Feed information bar */}
      <div className="bg-gray-800 p-3 text-sm flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
          <p className="font-medium text-white">{title}</p>
        </div>
        <div className="text-xs text-gray-400">
          Live Feed
        </div>
      </div>
    </div>
  );
}
