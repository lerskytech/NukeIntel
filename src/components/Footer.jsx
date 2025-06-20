import React from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiInfo } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-6 px-4 border-t border-gray-800 mt-auto bg-midnight">
      <motion.div 
        className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="text-center md:text-left">
          <motion.div 
            className="text-sm text-white bg-red-900/30 px-3 py-1 rounded-full flex items-center gap-1"
            whileHover={{ backgroundColor: 'rgba(185, 28, 28, 0.4)' }}
          >
            <span className="font-semibold">NukeIntel.com Domain For Sale</span>
          </motion.div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <motion.a 
            href="https://thebulletin.org/doomsday-clock/"
            target="_blank"
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-neon-blue flex items-center gap-1 transition-colors"
            aria-label="Learn more about the Doomsday Clock at the Bulletin of the Atomic Scientists"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiInfo size={14} />
            <span>Official Clock</span>
            <FiExternalLink size={12} className="ml-1 opacity-70" />
          </motion.a>
          
          <motion.a 
            href="https://github.com/bulletinoftheatomicscientists"
            target="_blank"
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-neon-yellow flex items-center gap-1 transition-colors"
            aria-label="View source code on GitHub"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiGithub size={14} />
            <span>GitHub</span>
          </motion.a>
        </div>
        
        <motion.div 
          className="text-sm text-gray-400"
          whileHover={{ color: '#a0aec0' }}
          transition={{ duration: 0.2 }}
        >
          &copy; {currentYear} NukeIntel.com • Premium Domain For Sale
        </motion.div>
      </motion.div>
      
      <div className="text-center mt-6 text-xs text-gray-500 max-w-2xl mx-auto">
        <p className="mb-2">
          The Doomsday Clock is a symbol that represents the likelihood of a human-made global catastrophe, maintained by the Bulletin of the Atomic Scientists. This is an unofficial tracker.
        </p>
        <p className="text-red-400">
          <strong>NukeIntel.com</strong> is a premium domain currently available for purchase. Contact via the inquiry form above.
        </p>
      </div>
    </footer>
  )
}

export default Footer
