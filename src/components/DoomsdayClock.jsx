import { useState, useEffect, useRef } from 'react'
import ClockModal from './ClockModal'
import { motion, AnimatePresence } from 'framer-motion'
import { useClockData } from '../hooks/useClockData'
import { FiAlertTriangle } from 'react-icons/fi'
import nuclearCrownIcon from '../assets/images/nuclear-crown.svg'

const DoomsdayClock = () => {
  const [showModal, setShowModal] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const [currentSeconds, setCurrentSeconds] = useState(0) // Track exact seconds for animation
  const [pulseEffect, setPulseEffect] = useState(false) // For pulsing animation
  const clockRef = useRef(null)
  const minuteHandRef = useRef(null)

  // Fetch clock data from API or use fallback
  const { data: clockData, isLoading, isError } = useClockData()
  
  // Extract Doomsday Clock data from API response
  const { 
    minutesToMidnight = 1.5, 
    secondsToMidnight = 89, // Direct from API or calculated from minutes
    lastUpdated, 
    statement,
    fetchedLive
  } = clockData || {};
  
  // For logging only - to verify data
  useEffect(() => {
    console.log('Clock data loaded:', { 
      minutesToMidnight, 
      secondsToMidnight,
      fetchedLive: fetchedLive || false,
      lastUpdated 
    });
  }, [minutesToMidnight, secondsToMidnight, lastUpdated, fetchedLive]);
  
  // Derived state for display
  // We show the exact seconds (not rounded) for more precision
  const displaySeconds = secondsToMidnight
  
  // Calculate minute hand angle to show exactly 89 seconds to midnight
  const getHandRotation = () => {
    return -8.9; // fixed at 89 seconds (1.48333 minutes) to midnight
  }
  
  // Hour hand position fixed at 11:58:31 (89 seconds to midnight)
  const getHourHandRotation = () => {
    return -0.74; // fixed position for hour hand at 11:58:31
  }

  // Animation effect when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Static pulsing effect without ticking animation
  // We keep the pulse effect for visual interest but remove the second hand ticking
  useEffect(() => {
    // Set pulse effect on a slow interval for visual interest
    const pulseInterval = setInterval(() => {
      setPulseEffect(prev => !prev);
    }, 3000);
    
    return () => {
      clearInterval(pulseInterval);
    };
  }, []);
  
  // Set current seconds to represent the 30 seconds position on the clock
  // This ensures all calculations and displays show the correct static time
  useEffect(() => {
    setCurrentSeconds(30); // 30 seconds fixed position
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
      
      {/* Clock visualization - completely redesigned for accuracy and visual impact */}
      <motion.div 
        className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] rounded-full border-[6px] border-gray-700 bg-black flex items-center justify-center mb-8 overflow-hidden"
        style={{ 
          boxShadow: pulseEffect 
            ? '0 0 30px rgba(0, 0, 0, 0.8), 0 0 60px rgba(255, 30, 50, 0.15), inset 0 0 40px rgba(0, 0, 0, 0.9)' 
            : '0 0 30px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 0, 0, 0.9)',
        }}
        role="img" 
        aria-label="Doomsday Clock visualization showing how close we are to midnight"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Deep black background with subtle texture */}
        <div 
          className="absolute inset-0 rounded-full bg-black"
          style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(0,0,0,1) 100%)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)' 
          }}
        />
        
        {/* Clock face */}
        <div className="absolute inset-2 rounded-full bg-black z-10"/>
        
        {/* Red danger zone - at top of clock (midnight) */}
        <motion.div 
          className="absolute w-[16%] h-[12%] z-20"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,30,30,0.8) 0%, rgba(255,0,0,0) 80%)',
            top: '5%',
            left: '42%',
            boxShadow: '0 0 10px rgba(255,0,0,0.2)',
          }}
          animate={{ opacity: pulseEffect ? [0.6, 0.8, 0.6] : [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Clock hour markers - much bolder and more professional */}
        {[...Array(12)].map((_, index) => {
          const hour = index === 0 ? 12 : index;
          const isMainHour = hour === 12 || hour === 3 || hour === 6 || hour === 9;
          const angle = index * 30;
          const radians = (angle - 90) * (Math.PI / 180);
          const radius = isMainHour ? 47 : 46; // Percentage of clock radius
          const x = 50 + radius * Math.cos(radians);
          const y = 50 + radius * Math.sin(radians);
          
          return isMainHour ? (
            <motion.div
              key={`hour-${index}`}
              className="absolute text-xl md:text-2xl font-bold z-30"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                color: hour === 12 ? '#ff1e3c' : 'rgba(255,255,255,0.85)', // Red for 12, white for others
                textShadow: hour === 12 ? 
                  '0 0 10px rgba(255, 30, 60, 0.9), 0 0 20px rgba(255, 30, 60, 0.6)' : 
                  '0 0 5px rgba(255, 255, 255, 0.3)'
              }}
              animate={{
                textShadow: hour === 12 && pulseEffect ?
                  '0 0 15px rgba(255, 30, 60, 1), 0 0 25px rgba(255, 30, 60, 0.8)' :
                  hour === 12 ? 
                  ['0 0 10px rgba(255, 30, 60, 0.8)', '0 0 15px rgba(255, 30, 60, 1)', '0 0 10px rgba(255, 30, 60, 0.8)'] :
                  '0 0 5px rgba(255, 255, 255, 0.3)'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {hour}
            </motion.div>
          ) : null;
        })}
        
        {/* Hour ticks - longer marks at each hour */}
        {[...Array(12)].map((_, index) => {
          const hour = index === 0 ? 12 : index;
          const isMainHour = hour === 12 || hour === 3 || hour === 6 || hour === 9;
          if (isMainHour) return null; // Skip where we have numbers
          
          const angle = index * 30;
          const radians = (angle - 90) * (Math.PI / 180);
          const outerRadius = 46; // Percentage of clock radius
          const innerRadius = 43; // Where the tick ends
          const outerX = 50 + outerRadius * Math.cos(radians);
          const outerY = 50 + outerRadius * Math.sin(radians);
          const innerX = 50 + innerRadius * Math.cos(radians);
          const innerY = 50 + innerRadius * Math.sin(radians);
          
          return (
            <motion.div
              key={`tick-${index}`}
              className="absolute bg-gray-400 z-20"
              style={{
                width: '2px',
                height: '2.5%',
                left: `${outerX}%`,
                top: `${outerY}%`,
                transformOrigin: 'center',
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                backgroundColor: hour === 12 ? 'rgba(255,50,50,0.9)' : 'rgba(200,200,200,0.7)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: index * 0.02 }}
            />
          );
        })}
        
        {/* Minute ticks - shorter marks */}
        {[...Array(60)].map((_, index) => {
          // Skip positions where hour ticks are
          if (index % 5 === 0) return null;
          
          const angle = index * 6;
          const radians = (angle - 90) * (Math.PI / 180);
          const outerRadius = 46; // Percentage of clock radius
          const innerRadius = 44.5; // Where the tick ends
          const outerX = 50 + outerRadius * Math.cos(radians);
          const outerY = 50 + outerRadius * Math.sin(radians);
          
          return (
            <motion.div
              key={`min-${index}`}
              className="absolute bg-gray-500 z-20"
              style={{
                width: '1px',
                height: '1%',
                left: `${outerX}%`,
                top: `${outerY}%`,
                transformOrigin: 'center',
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                opacity: 0.5
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 + index * 0.005 }}
            />
          );
        })}
        
        {/* Sunburst pattern in center - as seen in screenshot */}
        <div className="absolute w-[30%] h-[30%] left-[35%] top-[35%] z-25">
          {/* Generate sunburst rays */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute w-[7%] h-[40%] bg-orange-400 opacity-80 rounded-sm"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: 'bottom center',
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              }}
              animate={{ opacity: [0.7, 0.9, 0.7] }}
              transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
          
          {/* Add intermediate rays for fuller sunburst */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`ray-sm-${i}`}
              className="absolute w-[4%] h-[35%] bg-orange-300 opacity-60 rounded-sm"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: 'bottom center',
                transform: `translate(-50%, -100%) rotate(${(i * 30) + 15}deg)`,
              }}
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2.5, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
        
        {/* Rolex-inspired NukeIntel brand icon at 12 o'clock position */}
        <motion.div
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            transform: 'translate(-50%, 0)',
            top: '5%',
            left: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}
          animate={{
            scale: pulseEffect ? [1, 1.05, 1] : 1,
          }}
          transition={{ scale: { duration: 3, repeat: Infinity } }}
        >
          <img 
            src={nuclearCrownIcon} 
            alt="NukeIntel golden crown emblem" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </motion.div>
        
        {/* Hour hand - styled for a professional look */}
        <motion.div
          className="absolute z-40"
          style={{
            width: '2.5%',
            height: '25%',
            backgroundColor: 'rgba(220, 220, 240, 0.9)',
            bottom: '50%',
            left: '49%',
            transformOrigin: 'bottom center',
            borderRadius: '25% 25% 0 0',
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)'
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ 
            opacity: 1, 
            rotate: getHourHandRotation()
          }}
          transition={{ 
            type: 'spring',
            stiffness: 50,
            damping: 15,
            delay: 0.3
          }}
        />
        
        {/* Minute hand - main Doomsday indicator hand */}
        <motion.div 
          ref={minuteHandRef}
          className="absolute z-40"
          style={{
            width: '2%',
            height: '36%',
            backgroundColor: 'rgba(255, 40, 60, 0.9)',
            bottom: '50%',
            left: '49.2%',
            transformOrigin: 'bottom center',
            borderRadius: '25% 25% 0 0',
            boxShadow: pulseEffect 
              ? '0 0 8px rgba(255, 30, 50, 0.8)'
              : '0 0 5px rgba(255, 30, 50, 0.6)'
          }}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ 
            opacity: 1, 
            rotate: getHandRotation()
          }}
          transition={{ 
            type: 'spring',
            stiffness: 50,
            damping: 15,
            delay: 0.4
          }}
        />
        
        {/* Second hand - fixed at 89 seconds to midnight (30 seconds past 11:58) */}
        <motion.div 
          className="absolute z-40"
          style={{
            width: '1px',
            height: '42%',
            backgroundColor: 'rgba(255, 50, 50, 0.7)',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            boxShadow: '0 0 2px rgba(255, 0, 0, 0.5)'
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ 
            opacity: 0.8, 
            rotate: 186 // 31 seconds position (just past 6 o'clock)
          }}
          transition={{ 
            type: 'spring',
            stiffness: 50,
            damping: 15,
            delay: 0.6
          }}
        />
        
        {/* Center dot with bright red glow - matches the screenshot */}
        <motion.div
          className="absolute rounded-full z-50"
          style={{ 
            width: '7%',
            height: '7%',
            top: '46.5%',
            left: '46.5%',
            background: 'radial-gradient(circle, rgba(255,60,60,1) 0%, rgba(230,30,30,1) 90%)',
            boxShadow: '0 0 15px rgba(255, 30, 30, 0.9), 0 0 30px rgba(255, 0, 0, 0.5)'
          }}
          animate={{ 
            boxShadow: pulseEffect 
              ? '0 0 20px rgba(255, 30, 30, 1), 0 0 40px rgba(255, 0, 0, 0.7)'
              : '0 0 15px rgba(255, 30, 30, 0.9), 0 0 30px rgba(255, 0, 0, 0.5)'
          }}
          transition={{ duration: pulseEffect ? 0.3 : 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      
      {/* Digital readout styled after the screenshot */}
      <motion.div 
        className="text-center mb-6 bg-black border border-gray-900 w-full max-w-md py-6 px-8 rounded-xl"
        style={{ 
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.7)',
          background: 'linear-gradient(180deg, rgba(10,10,15,1) 0%, rgba(0,0,0,1) 100%)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Big bold seconds counter */}
          <motion.div className="flex items-end justify-center w-full mb-2">
            <motion.span
              className="text-6xl md:text-7xl font-bold tracking-tighter"
              style={{ 
                color: '#f02',
                textShadow: pulseEffect ? 
                  '0 0 25px rgba(255, 0, 30, 0.9), 0 0 40px rgba(255, 0, 30, 0.6)' : 
                  '0 0 20px rgba(255, 0, 30, 0.8), 0 0 30px rgba(255, 0, 30, 0.5)'
              }}
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255, 0, 30, 0.8), 0 0 30px rgba(255, 0, 30, 0.5)', 
                  '0 0 25px rgba(255, 0, 30, 0.9), 0 0 40px rgba(255, 0, 30, 0.6)', 
                  '0 0 20px rgba(255, 0, 30, 0.8), 0 0 30px rgba(255, 0, 30, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <AnimatePresence mode="wait">
                <motion.span 
                  key={displaySeconds}
                  className="tabular-nums"
                  initial={{ opacity: 0.8, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {displaySeconds}
                </motion.span>
              </AnimatePresence>
            </motion.span>
            
            <motion.span 
              className="text-3xl md:text-4xl font-bold ml-3 mb-1"
              style={{ 
                color: '#f02',
                textShadow: '0 0 15px rgba(255, 0, 30, 0.7), 0 0 25px rgba(255, 0, 30, 0.4)'
              }}
            >
              Seconds
            </motion.span>
          </motion.div>
          
          {/* To Midnight text in yellow */}
          <motion.p 
            className="text-2xl md:text-3xl font-bold mb-5"
            style={{ 
              color: '#ff3',
              textShadow: '0 0 10px rgba(255, 255, 50, 0.7), 0 0 20px rgba(255, 255, 50, 0.4)'
            }}
          >
            to Midnight
          </motion.p>
          
          {/* Source line with clean styling */}
          <div className="flex items-center justify-center text-white/80">
            <p className="text-sm">
              Set by the <span className="font-bold">Bulletin of Atomic Scientists</span>: 
              <span className="text-white/70">{formatLastUpdated(lastUpdated)}</span>
            </p>
          </div>
        </div>
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
