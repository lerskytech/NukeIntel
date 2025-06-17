import React, { useState, useEffect } from 'react';
import { FiTwitter, FiShare2, FiCopy, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component for sharing news articles to X/Twitter and other platforms
 */
const SocialShare = ({ article, relatedKeywords = [] }) => {
  const { currentUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [topHashtags, setTopHashtags] = useState([]);
  
  // Format article for sharing
  const shareText = `${article.title} | NukeIntel Doomsday Clock`;
  const shareUrl = article.url || window.location.href;
  
  // Prepare X/Twitter share URL
  const getTwitterShareUrl = (hashtags = []) => {
    const tags = hashtags.length > 0 
      ? `&hashtags=${encodeURIComponent(hashtags.join(','))}` 
      : '';
    
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}${tags}`;
  };
  
  // Process keywords into hashtags
  useEffect(() => {
    if (relatedKeywords && relatedKeywords.length > 0) {
      // Format keywords as hashtags (remove spaces, special chars)
      const hashtags = relatedKeywords
        .map(keyword => keyword.trim().toLowerCase())
        .map(keyword => keyword.replace(/[^\w]/g, ''))
        .filter(keyword => keyword.length > 0)
        .slice(0, 3); // Limit to top 3 hashtags
      
      setTopHashtags(hashtags);
    } else {
      // Default hashtags based on article category
      const defaultTags = [];
      if (article.category) {
        defaultTags.push(article.category);
      }
      defaultTags.push('DoomsdayClock', 'NukeIntel');
      setTopHashtags(defaultTags);
    }
  }, [article, relatedKeywords]);
  
  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Share to X/Twitter
  const shareToTwitter = () => {
    window.open(getTwitterShareUrl(topHashtags), '_blank');
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-neon-blue"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Share options"
      >
        <FiShare2 size={18} />
      </motion.button>
      
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-lg bg-gray-900 border border-gray-700 shadow-lg z-50"
            style={{ filter: 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.2))' }}
          >
            <div className="p-3">
              <h3 className="text-white text-sm font-medium mb-2">Share this article</h3>
              
              {topHashtags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {topHashtags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-gray-800 text-neon-blue"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <button
                  onClick={shareToTwitter}
                  disabled={!currentUser}
                  className={`w-full flex items-center px-3 py-2 rounded-md ${
                    currentUser 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiTwitter className="mr-2" />
                  {currentUser ? 'Share on X' : 'Sign in to share on X'}
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200"
                >
                  {copied ? <FiCheck className="mr-2 text-green-400" /> : <FiCopy className="mr-2" />}
                  {copied ? 'Link copied!' : 'Copy link'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;
