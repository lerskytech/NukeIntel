import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiveStream from './LiveStream';
import { webcamSources } from '../data/webcamSources';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * LiveFeed Component
 * Displays a horizontally scrollable list of live feeds from global hotspots
 */
export default function LiveFeed() {
  const [activeTab, setActiveTab] = useState(0);

  // Filter out reference sources that shouldn't be displayed
  const displayableSources = webcamSources.filter(source => !source.isReference);
  const [activeSource, setActiveSource] = useState(displayableSources[0]);
  const tabsContainerRef = React.useRef(null);

  // Handle source change via tab click
  const handleSourceChange = (index) => {
    setActiveTab(index);
    setActiveSource(displayableSources[index]);
    console.log(`Switched to feed: ${displayableSources[index].title}`);
  };

  // Handle scroll for tab navigation
  const handleScrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-red-600">Live Intelligence Feed</h2>
        <p className="text-gray-300">Real-time surveillance from global hotspots</p>
      </motion.div>

      {/* Tab Navigation - Horizontal Scrollable Tabs */}
      <div className="relative mb-4">
        {/* Left scroll button */}
        <button 
          onClick={() => handleScrollTabs('left')} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full z-10"
          aria-label="Scroll tabs left"
        >
          <FaChevronLeft className="text-white" />
        </button>

        {/* Tabs container */}
        <div 
          ref={tabsContainerRef}
          className="flex overflow-x-auto scrollbar-hide py-2 px-8 bg-gray-900 rounded-lg"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayableSources.map((source, index) => (
            <button
              key={source.id}
              id={`tab-${index}`}
              onClick={() => handleSourceChange(index)}
              className={`flex-shrink-0 px-4 py-2 mx-1 text-sm font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${activeTab === index 
                ? 'bg-red-800 text-white shadow-lg' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              aria-label={`View ${source.location} webcam`}
            >
              {source.location.split(',')[0]}
            </button>
          ))}
        </div>

        {/* Right scroll button */}
        <button 
          onClick={() => handleScrollTabs('right')} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full z-10"
          aria-label="Scroll tabs right"
        >
          <FaChevronRight className="text-white" />
        </button>
      </div>

      {/* Active stream */}
      <motion.div
        key={`feed-${activeSource.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LiveStream 
          webcamId={activeSource.id}
          title={activeSource.title}
          location={activeSource.location}
        />
      </motion.div>

      {/* Location info */}
      <div className="mt-4 bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-2 md:mb-0">
            <span className="font-semibold text-white">Location:</span> {activeSource.location}
          </div>
          <div>
            <span className="font-semibold text-white">Coordinates:</span> {activeSource.coordinates}
          </div>
        </div>
      </div>
    </div>
  );
}
