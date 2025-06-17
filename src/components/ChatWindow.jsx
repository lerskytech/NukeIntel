import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import { useNews } from '../hooks/useNews'
import { FiSend, FiRefreshCw, FiX } from 'react-icons/fi'

const ChatWindow = () => {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const chatContainerRef = useRef(null);
  
  // Get the latest news for context enhancement
  const { data: newsData } = useNews();
  
  // Topic suggestions for the user
  const topicSuggestions = [
    "What does the Doomsday Clock mean?",
    "Why is the clock at 90 seconds?",
    "How close were we during the Cold War?",
    "What are today's biggest threats?",
    "How can we reduce nuclear risks?",
    "What's the latest climate threat?"
  ];
  
  // Scroll to bottom of chat when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    // Show suggestions when no messages
    if (messages.length === 0 && suggestions.length === 0) {
      setSuggestions(topicSuggestions.slice(0, 3));
    } else if (messages.length > 0) {
      setSuggestions([]);
    }
  }, [messages]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Clear suggestions once user starts chatting
    setSuggestions([]);
    
    // Get the message content
    const messageContent = input;
    setInput('');
    
    try {
      // Get latest news for context
      const newsContext = newsData?.slice(0, 5) || [];
      
      // Send the message with news context
      await sendMessage(messageContent, newsContext);
    } catch (err) {
      console.error('Error in chat submission:', err);
      // Error is handled by useChat hook
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Submit the form programmatically
    handleSubmit(new Event('submit'));
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
        <motion.h2 
          className="text-xl font-bold text-neon-yellow"
          style={{ textShadow: '0 0 8px rgba(255, 253, 56, 0.7)' }}
          animate={{ textShadow: ['0 0 8px rgba(255, 253, 56, 0.7)', '0 0 15px rgba(255, 253, 56, 1)', '0 0 8px rgba(255, 253, 56, 0.7)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Ask the Clock
        </motion.h2>
        
        {messages.length > 0 && (
          <button 
            onClick={clearChat} 
            className="p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Clear chat history"
          >
            <FiRefreshCw size={16} />
          </button>
        )}
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="p-4 h-96 overflow-y-auto flex flex-col gap-3"
        aria-live="polite"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="text-gray-400 text-center mb-6 max-w-xs">
                <p className="mb-3">Ask about the Doomsday Clock, nuclear threats, or current global risks.</p>
              </div>
              
              {/* Topic suggestions */}
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {suggestions.map((suggestion, idx) => (
                  <motion.button
                    key={`suggestion-${idx}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-left border border-gray-700 rounded-lg text-sm text-gray-200 hover:text-white transition-colors"
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(75, 75, 75, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={`message-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-md ${
                    message.role === 'user'
                      ? 'bg-gray-700 text-white'
                      : 'bg-midnight text-white border border-gray-700'
                  }`}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 10 }}
                >
                  {message.content}
                </motion.div>
              </motion.div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-gray-400 mt-3 bg-gray-900 bg-opacity-40 self-start p-3 rounded-xl"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse-fast"></div>
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse-fast delay-150"></div>
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse-fast delay-300"></div>
              </div>
              <span className="text-sm">AI is analyzing threats...</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error message */}
        {error && (
          <motion.div 
            className="text-neon-red p-3 rounded-lg bg-red-900 bg-opacity-20 text-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      </div>
      
      {/* Input form */}
      <form 
        onSubmit={handleSubmit} 
        className="p-3 border-t border-gray-800 flex gap-2 items-center bg-gray-900 bg-opacity-50"
      >
        <motion.div className="relative flex-1">
          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about nuclear risks, clock history..."
            disabled={isLoading}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-neon-blue text-sm transition-all duration-200"
            aria-label="Type your message"
          />
          {input.trim() !== '' && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
              aria-label="Clear input"
            >
              <FiX size={14} />
            </button>
          )}
        </motion.div>
        
        <motion.button
          type="submit"
          disabled={isLoading || input.trim() === ''}
          className={`p-3 rounded-lg ${isLoading || input.trim() === '' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-neon-blue bg-opacity-80 text-white hover:bg-opacity-100'} transition-all duration-200 flex items-center justify-center`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Send message"
        >
          <FiSend size={18} />
        </motion.button>
      </form>
    </motion.div>
  )
}

export default ChatWindow
