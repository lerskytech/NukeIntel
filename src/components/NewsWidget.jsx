import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNews } from '../hooks/useNews';
import { FiAlertCircle, FiExternalLink, FiFilter, FiRefreshCw } from 'react-icons/fi';

const NewsWidget = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { data: news, isLoading, isError, refetch } = useNews(activeCategory);
  const [expanded, setExpanded] = useState(true);

  // Categories for filtering
  const categories = [
    { id: null, name: 'All' },
    { id: 'nuclear', name: 'Nuclear' },
    { id: 'military', name: 'Military' },
    { id: 'climate', name: 'Climate' },
    { id: 'diplomacy', name: 'Diplomacy' },
    { id: 'technology', name: 'Technology' }
  ];

  // Format date relative to now
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto mb-8 bg-gradient-to-b from-dark to-darkest rounded-xl border border-gray-800 overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Widget header */}
      <div className="bg-midnight p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            className="mr-2"
          >
            <FiAlertCircle className="text-neon-red" size={24} />
          </motion.div>
          <h2 className="text-xl font-bold text-white">
            Global Threat Monitor
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => refetch()} 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Refresh news"
            disabled={isLoading}
          >
            <FiRefreshCw className={`${isLoading ? 'animate-spin text-neon-blue' : 'text-gray-400'}`} />
          </button>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            aria-label={expanded ? 'Collapse news' : 'Expand news'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile news ticker for small screens */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 overflow-hidden">
        <div className="relative flex items-center h-10 overflow-hidden">
          <div className="animate-ticker whitespace-nowrap">
            {news?.filter(item => item.isBreaking)?.map((item, index) => (
              <span key={`ticker-${item.id}-${index}`} className="inline-block pr-8">
                <span className="text-neon-red font-bold mr-2">BREAKING:</span> 
                <span className="text-white">{item.title}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter categories */}
      {expanded && (
        <div className="p-3 bg-gray-900 flex flex-wrap items-center gap-2 border-b border-gray-800">
          <div className="flex items-center mr-2">
            <FiFilter className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-400">Filter:</span>
          </div>
          {categories.map(category => (
            <button
              key={category.id || 'all'}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === category.id 
                  ? 'bg-neon-red text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-pressed={activeCategory === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* News content */}
      {expanded && (
        <motion.div 
          className="bg-gradient-to-b from-darkest to-darkest divide-y divide-gray-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-pulse-fast h-8 w-8 rounded-full bg-gray-800 mb-2"></div>
              <p className="text-gray-400">Fetching latest news...</p>
            </div>
          ) : isError ? (
            <div className="p-6 text-center">
              <p className="text-neon-red mb-2">Unable to load news</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm text-white transition"
              >
                Try Again
              </button>
            </div>
          ) : news?.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">No news found for this filter</p>
            </div>
          ) : (
            <>
              {news?.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 hover:bg-gray-900 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: 'rgba(50, 50, 50, 0.3)' }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-medium text-white group-hover:text-neon-blue transition-colors">
                        {item.isBreaking && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neon-red text-white mr-2 animate-pulse-alert">
                            BREAKING
                          </span>
                        )}
                        {item.title}
                      </h3>
                      <div className="flex items-center mt-1 text-sm">
                        <span className="text-gray-400">{item.source}</span>
                        <span className="mx-2 text-gray-600">•</span>
                        <span className="text-gray-500">{formatRelativeTime(item.publishedAt)}</span>
                      </div>
                    </div>
                    <FiExternalLink className="text-gray-500 flex-shrink-0" />
                  </div>
                </motion.a>
              ))}
              <div className="p-3 bg-midnight border-t border-gray-800">
                <a 
                  href="https://www.thebulletin.org/nuclear-risk" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-sm text-neon-blue hover:underline"
                >
                  See all news on The Bulletin of the Atomic Scientists
                </a>
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsWidget;
