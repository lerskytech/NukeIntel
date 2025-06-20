import React from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiAlertTriangle } from 'react-icons/fi'

const Header = () => {
  return (
    <motion.header 
      className="py-8 px-4 relative border-b border-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
        <motion.div 
          className="inline-flex items-center justify-center mb-3"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <motion.div
            className="flex items-center justify-center bg-midnight p-2 rounded-full mr-3"
            animate={{
              boxShadow: ['0 0 0px rgba(255, 77, 77, 0.4)', '0 0 20px rgba(255, 77, 77, 0.7)', '0 0 0px rgba(255, 77, 77, 0.4)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FiClock className="text-neon-red" size={24} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-white">Nuke</span>
            <motion.span 
              className="text-neon-red ml-2"
              style={{ textShadow: '0 0 10px rgba(255, 77, 77, 0.7)' }}
              animate={{ textShadow: ['0 0 10px rgba(255, 77, 77, 0.7)', '0 0 20px rgba(255, 77, 77, 1)', '0 0 10px rgba(255, 77, 77, 0.7)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Intel
            </motion.span>
          </h1>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-center gap-2 text-neon-yellow text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FiAlertTriangle className="animate-pulse-slow" size={16} />
          <p className="font-medium">Real-time global threat monitoring</p>
        </motion.div>
        </div>
        
        {/* Domain Name Badge */}
        <div className="md:absolute md:right-6 md:top-6">
          <div className="px-4 py-2 bg-red-900/30 rounded-full flex items-center">
            <span className="text-red-400 font-bold">Domain For Sale</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
