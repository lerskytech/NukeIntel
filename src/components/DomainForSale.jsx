import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiDollarSign, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function DomainForSale() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Send to Formspree
      const response = await fetch('https://formspree.io/f/xeoklqnr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          message,
          subject: 'NukeIntel.com Domain Inquiry',
          _replyto: email,
          _recipient: 'lerskytech@gmail.com'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }
      
      console.log('Domain inquiry submitted to Formspree:', { email, message });
      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError('Failed to submit your inquiry. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-red-900 shadow-2xl my-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 text-center">
        <div className="inline-block mb-6 p-4 rounded-full bg-red-900/30">
          <FiDollarSign className="text-red-500 w-12 h-12" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">
          NukeIntel.com
        </h2>
        
        <div className="inline-flex items-center justify-center px-4 py-1 mb-4 bg-red-500/20 text-red-400 rounded-full">
          <span className="font-bold">PREMIUM DOMAIN FOR SALE</span>
        </div>
        
        <p className="text-gray-300 mb-6">
          This premium domain is available for acquisition. 
          Perfect for intelligence agencies, global risk assessment services, 
          or media organizations focused on geopolitical threats.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-6 text-left">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Your Email Address
              </label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Message (Optional)
              </label>
              <textarea 
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="I'm interested in purchasing this domain for..."
              ></textarea>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg flex items-center">
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-lg font-bold flex items-center justify-center transition-all ${
                loading ? 'bg-gray-700 text-gray-500' : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiMail className="mr-2" />
                  Submit Domain Inquiry
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-900/30 p-6 rounded-lg text-center"
          >
            <FiCheck className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Inquiry Received!</h3>
            <p className="text-gray-300">
              Thank you for your interest in NukeIntel.com. We'll be in touch soon at {email}.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
