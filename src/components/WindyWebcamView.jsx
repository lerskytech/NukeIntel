import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { windyWebcamsByShareId } from '../data/windyWebcams';
import WindyWebcamPlayer from './WindyWebcamPlayer';

/**
 * WindyWebcamView Component - For displaying a single webcam when accessed directly
 * This is a fallback to avoid requiring react-router-dom
 * @param {Object} props - Component props
 * @param {string} props.shareId - Share ID of the webcam to display
 * @param {function} props.onBack - Callback function to handle back navigation
 */
const WindyWebcamView = ({ shareId, onBack }) => {
  // Get webcam data from the shareId
  const webcam = windyWebcamsByShareId[shareId];
  
  // Handle back button click
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    } else {
      // Default fallback - simply clear URL parameters
      window.history.pushState({}, '', '/');
      window.location.reload();
    }
  };
  
  if (!webcam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Webcam Not Found</h1>
        <p className="text-gray-300 mb-6">The webcam you're looking for doesn't exist or may have been removed.</p>
        <button 
          onClick={handleBack} 
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <FaArrowLeft className="mr-2" /> Return to Homepage
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={handleBack}
        className="inline-flex items-center text-gray-400 hover:text-white mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to NukeIntel
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          {webcam?.city} {webcam?.label} <span className="text-red-500">Live Feed</span>
        </h1>
        
        <p className="text-gray-300 mb-6">{webcam?.description}</p>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          {webcam && (
            <WindyWebcamPlayer
              webcamId={webcam.id}
              city={webcam.city}
              label={webcam.label}
              highAlert={webcam.highAlert}
              shareId={webcam.shareId}
            />
          )}
        </div>
        
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-2">About this Location</h2>
          <p className="text-gray-300 mb-4">{webcam?.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {webcam?.tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WindyWebcamView;
