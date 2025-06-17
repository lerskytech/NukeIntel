import { useState, useRef, useEffect } from 'react'

const ChatWindow = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  
  // Demo responses for the chat
  const demoResponses = [
    "The Doomsday Clock currently stands at 90 seconds to midnight, the closest it's ever been to global catastrophe since its creation in 1947.",
    "Climate change remains one of the major factors influencing the Doomsday Clock setting. Rising global temperatures and extreme weather events continue to pose existential threats.",
    "The ongoing risk of nuclear conflict keeps the Doomsday Clock near midnight. There are approximately 13,000 nuclear warheads in the world today.",
    "Emerging technologies like AI present both opportunities and risks that the Bulletin of the Atomic Scientists considers when setting the Doomsday Clock.",
    "The furthest the Doomsday Clock has ever been from midnight was 17 minutes in 1991, following the end of the Cold War and signing of the Strategic Arms Reduction Treaty."
  ];
  
  // Scroll to bottom of chat when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      try {
        // Get a random demo response
        const randomIndex = Math.floor(Math.random() * demoResponses.length);
        const response = demoResponses[randomIndex];
        
        setChatHistory(prev => [...prev, { role: 'ai', content: response }]);
        setLoading(false);
      } catch (err) {
        setError('Failed to get a response. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-dark border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 bg-gray-900 border-b border-gray-800">
        <h2 className="text-xl font-bold neon-text-yellow text-center">Ask the Clock</h2>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="p-4 h-80 overflow-y-auto flex flex-col gap-3"
        aria-live="polite"
      >
        {chatHistory.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            Ask a question about the Doomsday Clock, global threats, or nuclear risk.
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-800 text-white border border-gray-700'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="text-neon-red text-center p-2">
            {error}
          </div>
        )}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800 flex gap-2">
        <label htmlFor="chat-input" className="sr-only">Type your message</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about global threats..."
          disabled={loading}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-neon-yellow"
          aria-label="Type your message"
        />
        <button
          type="submit"
          disabled={loading || input.trim() === ''}
          className={`px-4 py-2 rounded-lg ${
            loading || input.trim() === ''
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-neon-red bg-opacity-70 text-white hover:bg-opacity-100'
          } transition focus:outline-none focus:ring-2 focus:ring-neon-red focus:ring-opacity-50`}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatWindow
