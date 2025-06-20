import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiMessageSquare, FiSend, FiUser, FiUsers, FiTwitter, FiLogIn, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { fetchFeaturedNukeIntelPosts, createNukeIntelPost, fetchUserPosts } from '../services/twitterService';

/**
 * NukeIntelBlog - Component for creating and displaying #NukeIntel blog posts
 * Integrates with Twitter/X and allows users to create posts that appear on both platforms
 * Now fetches real tweets from @nukeintelnews with the #NukeIntel tag
 */
const NukeIntelBlog = () => {
  const { currentUser, signInWithX } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  // Load featured posts from Twitter service
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured posts from high-follower accounts with #NukeIntel tag
  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch real posts from Twitter service - minimum 50k followers
        const posts = await fetchFeaturedNukeIntelPosts(50000, 5);
        setFeaturedPosts(posts);
      } catch (err) {
        console.error('Error loading featured posts:', err);
        setError('Unable to load featured posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedPosts();
  }, []);
  
  // Fetch user's posts when logged in
  useEffect(() => {
    const loadUserPosts = async () => {
      if (currentUser) {
        try {
          const userPosts = await fetchUserPosts(currentUser.uid);
          setPosts(userPosts);
        } catch (err) {
          console.error('Error loading user posts:', err);
        }
      }
    };
    
    loadUserPosts();
  }, [currentUser]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle post submission
  const handleSubmitPost = async () => {
    if (!newPostContent.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the new post object
      const postContent = newPostContent.includes('#NukeIntel') 
        ? newPostContent 
        : `${newPostContent} #NukeIntel`;
      
      const newPost = {
        author: currentUser.displayName || 'User',
        handle: currentUser.reloadUserInfo?.screenName || 'user',
        content: postContent,
        userId: currentUser.uid,
        profileImage: currentUser.photoURL || null,
        followers: 0,
        verified: false
      };
      
      // Save to backend via Twitter service
      const savedPost = await createNukeIntelPost(newPost);
      
      // Add post to local state
      setPosts([savedPost, ...posts]);
      
      // Reset form
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sign in
  const handleSignIn = async () => {
    await signInWithX();
  };

  return (
    <motion.div
      className="w-full rounded-xl overflow-hidden shadow-xl border border-gray-800"
      style={{ background: 'linear-gradient(to bottom, #121212, #0a0a0a)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <FiTwitter className="text-neon-blue mr-2" size={18} />
          <h2 className="text-white font-medium">#NukeIntel Blog</h2>
        </div>
      </div>
      
      {/* Featured posts */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center mb-3">
          <FiUsers className="text-neon-blue mr-2" />
          <h3 className="text-sm font-medium text-gray-300">FEATURED #NUKEINTEL INSIGHTS</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse delay-150"></div>
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-gray-800 bg-opacity-30 rounded-lg">
            <FiAlertCircle size={24} className="mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400">{error}</p>
          </div>
        ) : featuredPosts.length > 0 ? (
          <div className="space-y-4 mb-6">
            {featuredPosts.map(post => (
              <motion.div
                key={post.id}
                className="p-4 rounded-lg bg-gray-800 bg-opacity-30 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  {post.profileImage ? (
                    <img
                      src={post.profileImage}
                      alt={post.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <FiUser className="text-gray-300" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-white">{post.author}</span>
                      {post.verified && (
                        <svg className="w-4 h-4 text-neon-blue ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>@{post.handle}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(post.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-white mb-2">{post.content}</div>
                <div className="text-sm text-gray-400 flex items-center">
                  <FiUsers className="mr-1" />
                  <span>{(post.followers || 0).toLocaleString()} followers</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-800 bg-opacity-30 rounded-lg">
            <p className="text-gray-400">No featured posts available at this time.</p>
          </div>
        )}
      </div>
      
      {/* Post creation form (for signed in users) */}
      <div className="p-4 border-b border-gray-800">
        {currentUser ? (
          <>
            <div className="flex items-center mb-3">
              <FiEdit className="text-neon-blue mr-2" />
              <h3 className="text-sm font-medium text-gray-300">CREATE A POST</h3>
            </div>
            
            <div className="bg-gray-800 bg-opacity-30 rounded-lg p-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your insights on nuclear security..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-neon-blue"
                rows={3}
              />
              
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Posts will be tagged with #NukeIntel
                </div>
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPostContent.trim() || isSubmitting}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${
                    !newPostContent.trim() || isSubmitting
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-neon-blue hover:bg-blue-600 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      <span>Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-800 bg-opacity-30 rounded-lg p-5 text-center">
            <FiMessageSquare className="mx-auto text-neon-blue mb-3" size={24} />
            <h3 className="text-white font-medium mb-2">Join the #NukeIntel Community</h3>
            <p className="text-gray-400 text-sm mb-4">Sign in to share your insights and contribute to the global security conversation</p>
            
            <button
              onClick={handleSignIn}
              className="flex items-center mx-auto space-x-2 bg-neon-blue hover:bg-blue-600 text-white rounded-md px-4 py-2 transition-colors"
            >
              <FiTwitter className="text-white" size={18} />
              <span>Sign in with X</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Recent user posts */}
      {currentUser && posts.length > 0 && (
        <div className="p-4">
          <div className="flex items-center mb-3">
            <FiMessageSquare className="text-neon-blue mr-2" />
            <h3 className="text-sm font-medium text-gray-300">YOUR RECENT POSTS</h3>
          </div>
          
          <div className="space-y-4">
            {posts.map(post => (
              <motion.div
                key={post.id}
                className="p-4 rounded-lg bg-gray-800 bg-opacity-30 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  {post.profileImage ? (
                    <img
                      src={post.profileImage}
                      alt={post.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <FiUser className="text-gray-300" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-white">{post.author}</div>
                    <div className="text-sm text-gray-400">
                      @{post.handle} • {formatDate(post.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-white">{post.content}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-800 bg-midnight flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Posts with #NukeIntel are automatically shared
        </div>
        <div className="flex items-center">
          <FiTwitter className="text-neon-blue mr-1" size={14} />
          <span className="text-xs text-gray-400">X Integration</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NukeIntelBlog;
