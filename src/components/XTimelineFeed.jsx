import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiMessageSquare, FiHash } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

/**
 * XTimelineFeed - Component to display X/Twitter timeline for specific hashtag or search
 * Embeds tweets related to nuclear security, global threats, and the #NukeIntel tag
 */
const XTimelineFeed = ({ keywords = [], defaultKeyword = 'NukeIntel' }) => {
  const { currentUser } = useAuth();
  const timelineContainerRef = useRef(null);
  const [selectedKeyword, setSelectedKeyword] = useState(defaultKeyword);
  const [isLoading, setIsLoading] = useState(true);
  const [timelineLoaded, setTimelineLoaded] = useState(false);

  // Function to load Twitter widgets
  const loadTwitterWidgetsScript = () => {
    // Remove any existing script first
    const existingScript = document.getElementById('twitter-widgets-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and add the Twitter widgets script
    const script = document.createElement('script');
    script.id = 'twitter-widgets-script';
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    script.onload = () => {
      if (window.twttr) {
        console.log('Twitter widgets loaded');
        setIsLoading(false);
      }
    };

    return () => {
      if (existingScript) {
        existingScript.remove();
      }
    };
  };

  // Initialize the Twitter timeline when component mounts or keyword changes
  useEffect(() => {
    loadTwitterWidgetsScript();
  }, []);

  // Load timeline when Twitter widgets are ready or when selectedKeyword changes
  useEffect(() => {
    if (window.twttr && timelineContainerRef.current) {
      setIsLoading(true);

      // Clear previous timeline
      if (timelineContainerRef.current) {
        timelineContainerRef.current.innerHTML = '';
      }

      // Create the search query
      // Format: nuclear OR "global security" OR doomsdayclock OR "atomic scientists"
      const searchQuery = selectedKeyword || keywords[0] || 'NukeIntel';
      
      // Create Twitter timeline
      window.twttr.widgets.createTimeline(
        {
          sourceType: 'search',
          search: `#${searchQuery} OR ${searchQuery}`,
        },
        timelineContainerRef.current,
        {
          height: 400,
          chrome: 'noheader, nofooter, noborders, transparent, noscrollbar',
          theme: 'dark',
          dnt: true,
          tweetLimit: 8,
        }
      ).then(() => {
        setIsLoading(false);
        setTimelineLoaded(true);
      }).catch(error => {
        console.error('Error creating Twitter timeline:', error);
        setIsLoading(false);
      });
    }
  }, [selectedKeyword, window.twttr]);

  // Combine default hashtags with dynamic keywords
  const allKeywords = [
    'NukeIntel',
    'DoomsdayClock',
    'NuclearSecurity',
    ...keywords.filter(k => !['NukeIntel', 'DoomsdayClock', 'NuclearSecurity'].includes(k))
  ].slice(0, 6); // Limit to 6 options

  return (
    <motion.div
      className="bg-gray-900 bg-opacity-30 border border-gray-800 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hashtag selector */}
      <div className="p-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center text-neon-blue">
          <FiHash size={16} className="mr-1" />
          <span className="font-medium text-sm">Timeline</span>
        </div>
        
        <button
          onClick={() => {
            if (window.twttr && timelineContainerRef.current) {
              setIsLoading(true);
              window.twttr.widgets.load(timelineContainerRef.current);
              setTimeout(() => setIsLoading(false), 1000);
            }
          }}
          className={`p-1 rounded-full hover:bg-gray-700 transition ${isLoading ? 'animate-spin text-neon-blue' : 'text-gray-400'}`}
        >
          <FiRefreshCw size={14} />
        </button>
      </div>
      
      {/* Hashtag options */}
      <div className="flex overflow-x-auto scrollbar-hidden py-2 px-3 border-b border-gray-800 gap-2">
        {allKeywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => setSelectedKeyword(keyword)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs transition-all ${
              selectedKeyword === keyword
                ? 'bg-neon-blue text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            #{keyword}
          </button>
        ))}
      </div>
      
      {/* Timeline container */}
      <div className="relative h-[400px] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-10">
            <div className="flex flex-col items-center">
              <div className="flex space-x-2 mb-3">
                <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse delay-150"></div>
                <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse delay-300"></div>
              </div>
              <span className="text-sm text-gray-300">Loading tweets...</span>
            </div>
          </div>
        )}
        
        <div
          ref={timelineContainerRef}
          className="h-full w-full overflow-y-auto"
        />
        
        {!isLoading && !timelineLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="text-center p-4">
              <FiMessageSquare size={24} className="mx-auto mb-3 text-gray-500" />
              <p className="text-gray-400">No tweets found for #{selectedKeyword}</p>
              <p className="text-sm text-gray-500 mt-2">Try another hashtag or check back later</p>
            </div>
          </div>
        )}
        
        {!currentUser && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4 flex flex-col items-center">
            <p className="text-sm text-gray-300 mb-2">Sign in with X to engage with these conversations</p>
            <div className="h-12"></div> {/* Spacer to prevent overlap with content */}
          </div>
        )}
      </div>
      
      {/* Call to action for logged in users */}
      {currentUser && (
        <div className="p-3 border-t border-gray-800 flex justify-between items-center">
          <span className="text-xs text-gray-400">Join the conversation</span>
          <a
            href={`https://twitter.com/intent/tweet?hashtags=${selectedKeyword}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs bg-neon-blue bg-opacity-20 hover:bg-opacity-30 text-neon-blue px-3 py-1.5 rounded-full transition"
          >
            <FiMessageSquare size={12} className="mr-1" /> 
            Tweet #
            {selectedKeyword}
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default XTimelineFeed;
