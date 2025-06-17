import { useState, useEffect, useRef } from 'react'
import ClockModal from './ClockModal'
import { motion } from 'framer-motion'
import { useClockData } from '../hooks/useClockData'

const DoomsdayClock = () => {
  const [showModal, setShowModal] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const [secondsCounter, setSecondsCounter] = useState(0)
  const clockRef = useRef(null)

  // Fetch clock data from API or use fallback
  const { data: clockData, isLoading, isError } = useClockData()
  
  // Extract minutes to midnight from data
  const minutesToMidnight = clockData?.minutesToMidnight / 60 || 1.5 // 90 seconds = 1.5 minutes
  const digitalSeconds = clockData?.minutesToMidnight || 90
  const lastUpdated = clockData?.lastUpdated || '2024-01-24T12:00:00Z'
  const statement = clockData?.statement || 'The Doomsday Clock stands at 90 seconds to midnight.'
  
  // Calculate clock hand angle based on minutes to midnight
  // 1.5 minutes = 90 seconds to midnight = -4.5 degrees from vertical (12 o'clock)
  const getHandRotation = (minutesToMidnight) => {
    // Each minute is 6 degrees on the clock (360 degrees / 60 minutes)
    // We need to rotate from the 12 o'clock position
    return minutesToMidnight * 6;
  }

  // Animation effect when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Optional effect for animating seconds ticking down
  useEffect(() => {
    // Animate ticking seconds for dramatic effect
    const interval = setInterval(() => {
      setSecondsCounter(prev => (prev + 1) % 60);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format the last updated date
  const formatLastUpdated = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col items-center px-4">
      {/* Status indicator */}
      {isLoading ? (
        <div className="text-neon-blue animate-pulse mb-2" aria-live="polite">Loading clock data...</div>
      ) : isError ? (
        <div className="text-neon-red mb-2" aria-live="polite">Using fallback data - couldn't connect to server</div>
      ) : null}
      
      {/* Clock visualization */}
      <motion.div 
        className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-4 border-gray-800 bg-darkest flex items-center justify-center mb-6"
        style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(0, 0, 0, 0.8)' }}
        role="img" 
        aria-label="Doomsday Clock visualization showing how close we are to midnight"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-dark to-darkest opacity-80"></div>
        
        {/* Clock ticks */}
        {[...Array(12)].map((_, index) => (
          <motion.div 
            key={index} 
            className="absolute w-1.5 h-6 bg-gray-300 shadow-neon-orange transform -translate-x-1/2"
            style={{
              left: '50%',
              transformOrigin: 'bottom center',
              transform: `rotate(${index * 30}deg) translateY(-46%)`,
              opacity: index === 0 ? 1 : 0.8,
              boxShadow: index === 0 ? '0 0 8px rgba(255, 0, 0, 0.8)' : ''
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === 0 ? 1 : 0.8 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
        
        {/* Smaller ticks */}
        {[...Array(60)].map((_, index) => {
          // Skip positions where large ticks are
          if (index % 5 === 0) return null;
          return (
            <motion.div 
              key={`small-${index}`} 
              className="absolute w-0.5 h-3 bg-gray-600 transform -translate-x-1/2"
              style={{
                left: '50%',
                transformOrigin: 'bottom center',
                transform: `rotate(${index * 6}deg) translateY(-48%)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: index * 0.01 + 0.5 }}
            />
          );
        })}
        
        {/* Center dot with pulsing effect */}
        <motion.div 
          className="absolute w-5 h-5 bg-neon-red rounded-full z-10"
          animate={{ boxShadow: ['0 0 8px rgba(255, 7, 58, 0.7)', '0 0 16px rgba(255, 7, 58, 0.9)', '0 0 8px rgba(255, 7, 58, 0.7)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Clock hour hand */}
        <motion.div 
          className="absolute w-1 h-22 bg-gray-400 origin-bottom transform -translate-x-1/2 -rotate-90"
          style={{
            bottom: '50%',
            left: '50%',
            zIndex: 5
          }}
          initial={{ opacity: 0, rotateZ: -90 }}
          animate={{ opacity: 0.8, rotateZ: -90 }}
          transition={{ delay: 0.2 }}
        />
        
        {/* Clock minute hand (Doomsday minute hand) */}
        <motion.div 
          ref={clockRef}
          className="absolute w-1.5 h-34 bg-neon-red origin-bottom shadow-clock-glow z-20"
          style={{
            bottom: '50%',
            left: '50%',
          }}
          initial={{ opacity: 0, rotateZ: -180 }}
          animate={{ 
            opacity: 1, 
            rotateZ: getHandRotation(minutesToMidnight) - 90 // properly offset for CSS rotation
          }}
          transition={{ 
            type: 'spring',
            stiffness: 50,
            damping: 15,
            delay: 0.5
          }}
        />
        
        {/* Midnight marker - glowing 12 */}
        <motion.div 
          className="absolute top-6 left-1/2 transform -translate-x-1/2 font-bold text-xl text-neon-red"
          style={{ textShadow: '0 0 10px rgba(255, 7, 58, 0.9), 0 0 20px rgba(255, 7, 58, 0.5)' }}
          animate={{ textShadow: ['0 0 10px rgba(255, 7, 58, 0.9)', '0 0 15px rgba(255, 7, 58, 1), 0 0 25px rgba(255, 7, 58, 0.8)', '0 0 10px rgba(255, 7, 58, 0.9)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          12
        </motion.div>
        
        {/* Clock numbers */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-300 font-bold">6</div>
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-300 font-bold">3</div>
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 font-bold">9</div>
      </motion.div>
      
      {/* Digital readout */}
      <motion.div 
        className="text-center mb-6 bg-darkest py-4 px-6 rounded-lg border border-gray-800 w-full max-w-md"
        style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-neon-red mb-1 animate-glow-pulse">
          <span className="tabular-nums">{digitalSeconds - (secondsCounter % Math.min(digitalSeconds, 60))}</span> <span className="text-2xl">Seconds</span>
        </h2>
        <p className="text-xl font-medium text-neon-yellow mb-3">to Midnight</p>
        <p className="text-sm text-gray-400">
          Set by the <span className="text-white">Bulletin of Atomic Scientists</span>: {formatLastUpdated(lastUpdated)}
        </p>
      </motion.div>
      
      {/* Statement box */}
      <motion.div 
        className="mb-6 text-center bg-opacity-20 bg-gray-800 p-4 rounded-md max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="italic text-gray-300">"{statement}"</p>
      </motion.div>
      
      {/* Learn More button */}
      <motion.button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-red border border-gray-700 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label="Learn more about the Doomsday Clock"
      >
        Learn About the Doomsday Clock
      </motion.button>
      
      {/* Modal */}
      {showModal && (
        <ClockModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default DoomsdayClock
