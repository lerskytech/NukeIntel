import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNews } from '../hooks/useNews';
import { FiRefreshCw, FiExternalLink, FiFilter, FiAlertCircle } from 'react-icons/fi';
import NewsModal from './NewsModal';

const NewsWidget = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { data: rawNews, isLoading, isError, refetch } = useNews(activeCategory);
  const [expanded, setExpanded] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Function to handle article selection for modal view
  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    console.log('Opening article in modal:', article.title);
  };
  
  // Additional client-side filter to ensure only real articles with valid URLs are displayed
  // This serves as a final safety check against any placeholder or mock data
  const news = useMemo(() => {
    if (!rawNews || !Array.isArray(rawNews)) return [];
    
    // Log raw news data for debugging
    console.log('Raw news received:', rawNews);
    
    return rawNews.filter(article => {
      // Verify we have a legitimate article with real URL
      const isValid = article && 
        article.url && 
        typeof article.url === 'string' && 
        article.url.startsWith('http') &&
        article.url !== '#' &&
        article.title &&
        article.source && 
        // Filter out known placeholder sources
        !['Global News Network', 'Science Daily', 'World Affairs', 
          'Tech Review', 'Diplomatic Times', 'Example Source'].includes(article.source);
          
      // For debugging
      if (!isValid && article) {
        console.log('Filtering out invalid article:', article);
      }
      
      return isValid;
    });
  }, [rawNews]);
  
  // Debug: Log final news list
  useEffect(() => {
    console.log('Final filtered news list:', news);
  }, [news]);
  
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
          >
            <FiRefreshCw 
              className={`text-gray-400 ${isLoading ? 'animate-spin text-neon-blue' : ''}`} 
              size={18} 
            />
          </button>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <FiFilter className="text-gray-400" size={18} />
          </button>
        </div>
      </div>
      
      {/* Category filter */}
      {expanded && (
        <motion.div 
          className="flex flex-wrap gap-2 p-3 bg-midnight border-b border-gray-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {categories.map(category => (
            <button
              key={category.id ?? 'all'}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeCategory === category.id 
                  ? 'bg-neon-blue text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </motion.div>
      )}
      
      {/* News list */}
      {expanded && (
        <motion.div 
          className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <FiRefreshCw className="text-neon-blue" size={30} />
              </motion.div>
              <span className="ml-3 text-gray-400">Loading news...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FiAlertCircle className="text-neon-red mb-4" size={40} />
              <h3 className="text-lg font-medium text-white mb-2">Error loading news</h3>
              <p className="text-gray-400 mb-4">Unable to retrieve news updates at this time.</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-neon-blue text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FiRefreshCw className="mr-2" size={16} /> Try again
              </button>
            </div>
          ) : news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FiAlertCircle className="text-neon-yellow mb-4" size={40} />
              <h3 className="text-lg font-medium text-white mb-2">No verified news sources available</h3>
              <p className="text-gray-400 mb-4">We couldn't find any verified news articles for this category.</p>
            </div>
          ) : (
            <>
              {news.map((item, index) => (
                <motion.div
                  key={item.id || `news-${index}`}
                  className="block p-4 hover:bg-gray-900 transition-colors cursor-pointer group"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: 'rgba(50, 50, 50, 0.3)' }}
                  onClick={() => {
                    // Open article in modal instead of leaving the site
                    handleArticleSelect(item);
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-white group-hover:text-neon-blue transition-colors flex items-center">
                        {item.isBreaking && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neon-red text-white mr-2 animate-pulse-alert">
                            BREAKING
                          </span>
                        )}
                        <span className="hover:underline">{item.title}</span>
                        <FiExternalLink className="inline-flex ml-2 text-neon-blue" size={16} />
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center mt-1 text-sm">
                        <span className="text-gray-400">{item.source}</span>
                        <span className="mx-2 text-gray-600">•</span>
                        <span className="text-gray-500">{formatRelativeTime(item.publishedAt)}</span>
                      </div>
                      <div className="mt-3">
                        <button 
                          className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-neon-blue border border-neon-blue/30 hover:border-neon-blue/70 text-xs font-medium rounded-md transition-all flex items-center shadow-sm hover:shadow-neon-blue/20"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            handleArticleSelect(item); // Open in modal instead
                          }}
                        >
                          Read Article <FiExternalLink className="ml-1.5" />
                        </button>
                      </div>
                    </div>
                    {item.imageUrl && (
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
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
      
      {/* News Article Modal */}
      {selectedArticle && (
        <NewsModal 
          article={selectedArticle} 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            // Don't clear the article immediately for smoother transition
            setTimeout(() => setSelectedArticle(null), 300);
          }} 
        />
      )}
    </motion.div>
  );
};

export default NewsWidget;
