import { useState } from 'react';
import OpenAI from 'openai';

// Demo responses if API is not available
const DEMO_RESPONSES = [
  "Based on current global events and the Doomsday Clock setting at 90 seconds to midnight, tensions between nuclear powers remain extremely high. The recent diplomatic breakdown between major powers and ongoing conflicts in multiple regions have significantly increased global risk.",
  "The Doomsday Clock at 90 seconds to midnight reflects several converging threats: climate change acceleration, nuclear proliferation, and emerging technologies risks. Recent missile tests and cyber attacks have further destabilized international relations.",
  "Today's news about increased military activity in contested regions is concerning. With the Doomsday Clock at its closest point to midnight in history (90 seconds), experts are carefully monitoring these developments as potential escalation triggers.",
  "When analyzing current nuclear risks, I must point to both state and non-state actors. The Bulletin of Atomic Scientists maintains the 90-second Doomsday Clock setting due to multiple factors including weapons modernization programs and treaty withdrawals.",
  "Climate change functions as a threat multiplier, exacerbating geopolitical tensions. The Doomsday Clock setting at 90 seconds to midnight acknowledges how resource scarcity and climate disasters are increasingly driving conflict potential."
];

/**
 * Custom hook to handle ChatGPT interactions
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize OpenAI (in production, use environment variables for the API key)
  // const openai = new OpenAI({
  //   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  //   dangerouslyAllowBrowser: true // Note: For production, call the API from a backend
  // });

  /**
   * Send a message to OpenAI's API
   * 
   * @param {string} userMessage - The message from the user
   * @param {Array} newsContext - Recent news articles to provide context to the AI
   */
  const sendMessage = async (userMessage, newsContext = []) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to chat history
      const userMsg = { role: 'user', content: userMessage };
      setMessages(prev => [...prev, userMsg]);
      
      // In a real implementation, you would send the message to OpenAI API
      // with news context included
      
      /*
      // Format news for context
      let newsContextStr = '';
      if (newsContext && newsContext.length > 0) {
        newsContextStr = "Recent nuclear and global threat news:\n" + 
          newsContext.slice(0, 5).map(article => 
            `- ${article.title} (${article.source}, ${new Date(article.publishedAt).toLocaleDateString()})`
          ).join('\n');
      }
      
      // System prompt with news context
      const systemPrompt = `You are Doomsday Clock GPT, an expert in nuclear risk, global conflict,
      existential threats, and the Doomsday Clock. Use the most current news and data available.
      The current Doomsday Clock setting is 90 seconds to midnight (as of January 24, 2024).
      
      ${newsContextStr}
      
      Provide accurate, informative responses about nuclear threats, the Doomsday Clock, 
      and global security issues. Reference news items when relevant. Be concise but thorough.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview", // Use appropriate model
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
          userMsg
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const aiMessage = { role: 'assistant', content: response.choices[0].message.content };
      */
      
      // For demo: Use a random response from demo responses
      // In production, replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const randomResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      const aiMessage = { role: 'assistant', content: randomResponse };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      return aiMessage;
      
    } catch (err) {
      console.error('Error sending message to OpenAI:', err);
      setError('Failed to get a response. Please try again.');
      setIsLoading(false);
      return null;
    }
  };

  /**
   * Clear the chat history
   */
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
};
