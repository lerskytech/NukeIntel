import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiTwitter, FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { currentUser, signInWithX, logout, error } = useAuth();

  const handleLogin = async () => {
    await signInWithX();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {currentUser ? (
        <div className="flex items-center space-x-2">
          <motion.div 
            className="flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full px-3 py-1.5 border border-gray-700"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-neon-blue"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <FiUser className="text-gray-300" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-neon-blue rounded-full p-0.5">
                <FiTwitter className="text-white text-xs" />
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="text-sm font-medium text-white truncate max-w-[120px]">
                {currentUser.displayName || 'User'}
              </div>
              <div className="text-xs text-gray-400">
                @{currentUser.reloadUserInfo?.screenName || 'user'}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="ml-1 p-1.5 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Log out"
            >
              <FiLogOut className="text-gray-400 hover:text-neon-blue" size={16} />
            </button>
          </motion.div>
        </div>
      ) : (
        <motion.button
          onClick={handleLogin}
          className="flex items-center space-x-2 bg-neon-blue hover:bg-blue-600 text-white rounded-md px-4 py-2 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiTwitter className="text-white" size={18} />
          <span>Sign in with X</span>
        </motion.button>
      )}

      {error && (
        <div className="absolute top-full mt-2 right-0 bg-red-900 text-white text-sm px-3 py-1 rounded-md">
          {error}
        </div>
      )}
    </motion.div>
  );
};

export default UserProfile;
