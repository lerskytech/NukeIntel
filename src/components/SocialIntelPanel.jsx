import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiTwitter, FiMessageCircle, FiHash, FiEdit, 
  FiShare2, FiExternalLink, FiUser, FiUsers 
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import XTimelineFeed from "./XTimelineFeed";
import NukeIntelBlog from "./NukeIntelBlog";

// Error boundary component for catching rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900 bg-opacity-20 rounded border border-red-800">
          <h3 className="text-red-400 font-medium mb-2">Component Error</h3>
          <p className="text-white text-sm mb-2">{this.props.fallbackMessage || "Failed to load this component"}</p>
          <p className="text-gray-400 text-xs">{this.state.error?.message || "Unknown error"}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * SocialIntelPanel - A component for social sharing and insights
 * Rebuilt with proper error handling to prevent black screen issues
 */
const SocialIntelPanel = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('timeline'); // Options: 'timeline', 'blog'
  const [trendingTopics] = useState(['NukeIntel', 'DoomsdayClock', 'NuclearSecurity']);
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Simulate loading news articles
  useEffect(() => {
    const loadNewsArticles = async () => {
      try {
        setError(null);
        // Sample news articles for demonstration
        const demoArticles = [
          { 
            id: 1, 
            title: 'Experts Warn of Increasing Nuclear Risks Due to Climate Change',
            source: 'Global Security Review',
            timestamp: new Date(),
            url: '#'
          },
          { 
            id: 2, 
            title: 'Nuclear Powers Agree to New Talks on Arms Reduction',
            source: 'Defense Policy Institute',
            timestamp: new Date(Date.now() - 24*60*60*1000),
            url: '#'
          },
          { 
            id: 3,
            title: 'Analysis: How Close Are We to Nuclear Midnight?',
            source: 'Science Today',
            timestamp: new Date(Date.now() - 2*24*60*60*1000),
            url: '#'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setNewsArticles(demoArticles);
          setNewsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error loading news articles:', err);
        setError(err.message || 'Failed to load news');
        setNewsLoading(false);
      }
    };
    
    loadNewsArticles();
  }, []);
  
  // User profile component
  const UserProfile = () => {
    if (!currentUser) {
      return (
        <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <FiUser size={14} className="text-gray-400" />
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        {currentUser.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt={currentUser.displayName || "User"} 
            className="w-7 h-7 rounded-full border border-gray-700" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/28";
            }}
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
            <FiUser size={14} className="text-gray-400" />
          </div>
        )}
      </div>
    );
  };
  
  // Share an article to Twitter/X
  const shareToTwitter = (article) => {
    if (!article?.title) return;
    
    const text = encodeURIComponent(`${article.title} #NukeIntel #DoomsdayClock`);
    const url = encodeURIComponent(article.url || window.location.href);
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    
    window.open(twitterIntentUrl, '_blank');
  };
  
  return (
    <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-xl border border-gray-800"
      style={{ backgroundColor: "#121212", color: "white" }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center">
          <FiTwitter size={18} style={{ color: "#2bd2ff", marginRight: "10px" }} />
          <h2 style={{ color: "#2bd2ff", fontWeight: "bold", fontSize: "1.25rem" }}>NukeIntel Social</h2>
        </div>
        <UserProfile />
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800">
        <button 
          className={`flex-1 py-2 flex items-center justify-center ${activeTab === 'timeline' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}
          onClick={() => setActiveTab('timeline')}
        >
          <FiTwitter className="mr-2" size={14} />
          <span>Timeline</span>
        </button>
        <button 
          className={`flex-1 py-2 flex items-center justify-center ${activeTab === 'blog' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}
          onClick={() => setActiveTab('blog')}
        >
          <FiMessageCircle className="mr-2" size={14} />
          <span>Blog</span>
        </button>
      </div>
      
      {/* Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'timeline' ? (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-gray-200 text-sm font-medium mb-2 flex items-center">
                  <FiHash size={14} className="mr-1" /> Trending
                </h3>
                <div className="flex flex-wrap">
                  {trendingTopics.map((topic, index) => (
                    <span 
                      key={`trend-${index}`}
                      className="px-3 py-1 text-sm text-blue-400 bg-blue-900 bg-opacity-20 rounded-full mr-2 mb-2"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Twitter Timeline Feed */}
              <ErrorBoundary fallbackMessage="Unable to load Twitter timeline. Please refresh.">
                <div className="mt-2 bg-gray-900 rounded">
                  <div className="p-3">
                    <h3 className="text-white font-semibold flex items-center mb-1">
                      <FiTwitter size={16} className="mr-2 text-blue-400" />
                      Latest Updates
                    </h3>
                  </div>
                  <div className="border-t border-gray-800">
                    <XTimelineFeed />
                  </div>
                </div>
              </ErrorBoundary>
            </div>
          ) : (
            <div className="p-4">
              {/* Blog Content */}
              <ErrorBoundary fallbackMessage="Unable to load blog content. Please refresh.">
                <div className="rounded overflow-hidden">
                  <NukeIntelBlog />
                </div>
              </ErrorBoundary>
              
              {/* News Articles */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h3 className="text-gray-200 text-sm font-medium mb-3 flex items-center">
                  <FiEdit size={14} className="mr-1" /> Recent Articles
                </h3>
                
                {error && (
                  <div className="p-3 bg-red-900 bg-opacity-20 rounded border border-red-800 mb-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                
                {newsLoading ? (
                  <div className="space-y-2">
                    <div className="h-16 bg-gray-800 animate-pulse rounded"></div>
                    <div className="h-16 bg-gray-800 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newsArticles.map(article => (
                      <div key={article.id} className="bg-gray-900 rounded overflow-hidden">
                        <div className="p-3">
                          <h4 className="text-white text-sm font-medium mb-1">{article.title}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-xs">{article.source}</span>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => shareToTwitter(article)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <FiShare2 size={14} />
                              </button>
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-300"
                              >
                                <FiExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SocialIntelPanel;
