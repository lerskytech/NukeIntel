import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink } from 'react-icons/fi';

/**
 * Modal component for displaying news articles inline without leaving the site
 * Provides iframe preview of news sources with fallback to external link
 */
const NewsModal = ({ article, isOpen, onClose }) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Only render if we have an article
  if (!article) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          onClick={onClose} // Close when backdrop is clicked
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-gradient-to-b from-dark to-darkest rounded-xl border border-gray-800 shadow-2xl shadow-blue-900/30 overflow-hidden"
            onClick={e => e.stopPropagation()} // Prevent closing when modal body is clicked
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-midnight">
              <h2 className="text-xl font-bold text-white truncate pr-4">{article.title}</h2>
              <div className="flex items-center space-x-2">
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors text-neon-blue"
                  aria-label="Open in new tab"
                  onClick={e => e.stopPropagation()}
                >
                  <FiExternalLink />
                </a>
                <button 
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                  onClick={onClose}
                >
                  <FiX />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex flex-col md:flex-row">
              {/* Article Info */}
              <div className="p-6 md:w-1/3">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-2">Source</h3>
                  <p className="text-gray-300">{article.source}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-gray-300">{article.description}</p>
                </div>
                
                {article.category && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">Category</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-200">
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </span>
                  </div>
                )}
                
                <div className="mt-6">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-neon-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Read Full Article <FiExternalLink className="ml-2" />
                  </a>
                </div>
              </div>
              
              {/* Article Preview */}
              <div className="md:w-2/3 bg-gray-900 h-[400px] md:h-[600px] p-1">
                <div className="w-full h-full rounded overflow-hidden bg-white">
                  <iframe
                    src={article.url}
                    title={article.title}
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts"
                    loading="lazy"
                    onError={(e) => {
                      // If iframe fails to load, show a message
                      e.target.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'flex items-center justify-center h-full bg-gray-900 text-gray-400 p-8 text-center';
                      errorDiv.innerHTML = `
                        <div>
                          <p class="mb-4">Unable to display preview for security reasons.</p>
                          <a 
                            href="${article.url}" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="inline-flex items-center px-4 py-2 bg-neon-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Open in New Tab <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                        </div>
                      `;
                      e.target.parentNode.appendChild(errorDiv);
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsModal;
