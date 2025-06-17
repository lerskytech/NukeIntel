import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTwitter, FiShare2, FiRefreshCw, FiExternalLink, FiTrendingUp, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNews } from '../hooks/useNews';
import { fetchRelatedKeywords } from '../services/keywordService';
import UserProfile from './UserProfile';
import XTimelineFeed from './XTimelineFeed';

/**
 * SocialIntelPanel - A component for social sharing and insights
 * Replaces the "Ask the Clock" chat functionality with X/Twitter integration
 */
const SocialIntelPanel = () => {
  const { currentUser } = useAuth();
  const { data: newsArticles, isLoading: newsLoading, refetch: refetchNews } = useNews();
  
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  
  // Generate trending topics based on all news articles
  useEffect(() => {
    const generateTrendingTopics = async () => {
      if (newsArticles && newsArticles.length > 0) {
        setTrendingLoading(true);
        
        try {
          // Extract keywords from all articles and count occurrences
          const allKeywords = [];
          
          // Process each article in parallel
          const keywordsPromises = newsArticles.slice(0, 10).map(article => 
            fetchRelatedKeywords(article)
          );
          
          const keywordSets = await Promise.all(keywordsPromises);
          
          // Flatten and count occurrences
          const keywordCounts = {};
          keywordSets.flat().forEach(keyword => {
            if (!keywordCounts[keyword]) {
              keywordCounts[keyword] = 0;
            }
            keywordCounts[keyword]++;
          });
          
          // Sort by count and take top 8
          const sortedTopics = Object.entries(keywordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([keyword]) => keyword);
            
          setTrendingTopics(sortedTopics);
        } catch (error) {
          console.error("Error generating trending topics:", error);
          // Fallback trending topics
          setTrendingTopics(['NuclearSecurity', 'ClimateAction', 'DoomsdayClock', 'GlobalThreats']);
        } finally {
          setTrendingLoading(false);
        }
      }
    };
    
    generateTrendingTopics();
  }, [newsArticles]);
  
  // Share article to X/Twitter
  const shareToTwitter = (article) => {
    const shareText = `${article.title} | NukeIntel Doomsday Clock`;
    const shareUrl = article.url || window.location.href;
    
    // Get trending topics to use as hashtags
    const hashtags = trendingTopics.slice(0, 3).join(',');
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(hashtags)}`;
    
    window.open(twitterUrl, '_blank');
  };
  
  return (
    <motion.div 
      className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-xl relative border border-gray-800"
      style={{ background: 'linear-gradient(to bottom, #121212, #0a0a0a)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center bg-midnight">
        <motion.div
          className="flex items-center"
        >
          <motion.div
            className="mr-2 text-neon-blue"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <FiTwitter size={18} />
          </motion.div>
          <motion.h2 
            className="text-xl font-bold text-neon-blue"
            style={{ textShadow: '0 0 8px rgba(29, 161, 242, 0.7)' }}
            animate={{ textShadow: ['0 0 8px rgba(29, 161, 242, 0.7)', '0 0 15px rgba(29, 161, 242, 1)', '0 0 8px rgba(29, 161, 242, 0.7)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Social Intel
          </motion.h2>
        </motion.div>
        
        <button 
          onClick={() => refetchNews()}
          disabled={newsLoading}
          className={`p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors ${
            newsLoading ? 'animate-spin text-neon-blue' : ''
          }`}
          aria-label="Refresh intel"
        >
          <FiRefreshCw size={16} />
        </button>
      </div>
      
      {/* Content area - increased height to accommodate timeline */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '500px' }}>
        {/* If not signed in, show login prompt */}
        {!currentUser ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-full p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiTwitter size={40} className="text-neon-blue mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect with X</h3>
            <p className="text-gray-400 mb-6 max-w-xs">
              Sign in with your X account to share critical intelligence and engage with the global security conversation.
            </p>
            <UserProfile />
          </motion.div>
        ) : (
          <>
            {/* Trending Topics Section */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center text-sm text-gray-400">
                  <FiTrendingUp size={14} className="mr-1 text-neon-blue" />
                  <span>TRENDING SECURITY TOPICS</span>
                </div>
                
                <button
                  onClick={refetchNews}
                  className={`p-1 rounded-full hover:bg-gray-800 ${newsLoading ? 'animate-spin text-neon-blue' : 'text-gray-500'}`}
                  aria-label="Refresh news"
                  disabled={newsLoading}
                >
                  <FiRefreshCw size={14} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {trendingLoading ? (
                  <div className="flex space-x-2 py-2">
                    <div className="h-7 w-24 rounded-full bg-gray-800 animate-pulse"></div>
                    <div className="h-7 w-16 rounded-full bg-gray-800 animate-pulse"></div>
                    <div className="h-7 w-20 rounded-full bg-gray-800 animate-pulse"></div>
                  </div>
                ) : (
                  trendingTopics.map((topic, index) => (
                    <a
                      key={index}
                      href={`https://twitter.com/search?q=%23${encodeURIComponent(topic)}&src=typed_query`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-gray-700 text-white text-xs py-1 px-2.5 rounded-full transition-all duration-200"
                    >
                      #{topic}
                    </a>
                  ))
                )}
              </div>
            </div>
            
            {/* Two column layout for larger screens */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* News Articles for Sharing - Column 1 */}
              <div>
                <AnimatePresence>
                  {newsLoading ? (
                    <motion.div 
                      className="flex justify-center py-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex space-x-2 items-center">
                        <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse delay-150"></div>
                        <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse delay-300"></div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.1 }}
                    >
                      <h3 className="text-sm font-medium text-gray-400 mb-3">SHARE CRITICAL INTELLIGENCE</h3>
                      
                      {newsArticles?.slice(0, 5).map((article, index) => (
                        <motion.div
                          key={index}
                          className="p-3 rounded-lg bg-gray-800 bg-opacity-40 border border-gray-800 hover:border-gray-700"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-sm font-medium text-white mb-1 line-clamp-2">{article.title}</div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-400">
                              {article.source || "News Source"}
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                className="p-1.5 hover:bg-gray-700 rounded-full text-gray-400 hover:text-neon-blue transition-colors"
                                onClick={() => shareToTwitter(article)}
                                aria-label="Share to X"
                              >
                                <FiShare2 size={14} />
                              </button>
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-gray-700 rounded-full text-gray-400 hover:text-neon-blue transition-colors"
                                aria-label="Open article"
                              >
                                <FiExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* X Timeline Feed - Column 2 */}
              <div className="mb-4">
                <XTimelineFeed keywords={trendingTopics} defaultKeyword="NukeIntel" />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Footer - always visible */}
      <div className="p-3 border-t border-gray-800 bg-gray-900 bg-opacity-50 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {currentUser ? 
            `Signed in as @${currentUser.reloadUserInfo?.screenName || 'user'}` : 
            "Sign in to share intel"
          }
        </div>
        {currentUser && (
          <div className="flex">
            <a
              href="https://twitter.com/intent/tweet?hashtags=NukeIntel,DoomsdayClock"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-xs text-neon-blue hover:underline"
            >
              <FiMessageCircle size={12} className="mr-1" />
              Start a New Thread
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SocialIntelPanel;
