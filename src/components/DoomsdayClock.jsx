import { useState, useEffect, useRef } from 'react'
import ClockModal from './ClockModal'

const DoomsdayClock = ({ minutesToMidnight, digitalSeconds, onClockAdjust }) => {
  const [showModal, setShowModal] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const clockRef = useRef(null)
  
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

  return (
    <div className="flex flex-col items-center">
      {/* Clock visualization */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-4 border-gray-700 bg-dark flex items-center justify-center mb-6"
           role="img" 
           aria-label="Doomsday Clock visualization showing how close we are to midnight">
        
        {/* Clock ticks */}
        {[...Array(12)].map((_, index) => (
          <div 
            key={index} 
            className="absolute w-1 h-6 bg-gray-400 shadow-neon-yellow transform -translate-x-1/2"
            style={{
              left: '50%',
              top: index === 0 ? '8px' : 'auto',
              bottom: index === 6 ? '8px' : 'auto',
              right: index === 3 ? '8px' : 'auto',
              left: index === 9 ? '8px' : 'auto',
              transform: `rotate(${index * 30}deg) translateY(-42px)`
            }}
          />
        ))}
        
        {/* Smaller ticks */}
        {[...Array(60)].map((_, index) => {
          // Skip positions where large ticks are
          if (index % 5 === 0) return null;
          return (
            <div 
              key={index} 
              className="absolute w-0.5 h-3 bg-gray-600 transform -translate-x-1/2"
              style={{
                left: '50%',
                transform: `rotate(${index * 6}deg) translateY(-46px)`
              }}
            />
          );
        })}
        
        {/* Center dot */}
        <div className="absolute w-4 h-4 bg-white rounded-full shadow-neon z-10"></div>
        
        {/* Clock hour hand */}
        <div 
          className="absolute w-1 h-20 bg-gray-400 origin-bottom transform -translate-x-1/2 -rotate-90"
          style={{
            bottom: '50%',
            left: '50%'
          }}
        ></div>
        
        {/* Clock minute hand (Doomsday minute hand) */}
        <div 
          ref={clockRef}
          className={`absolute w-1.5 h-32 bg-neon-red origin-bottom transform -translate-x-1/2 transition-transform duration-2000 z-5 shadow-neon`}
          style={{
            bottom: '50%',
            left: '50%',
            transform: `translateX(-50%) rotate(${isAnimating ? -90 : getHandRotation(minutesToMidnight) - 90}deg)`,
            transition: isAnimating ? 'transform 2s ease-out' : 'transform 0.5s ease-out'
          }}
        ></div>
        
        {/* Midnight marker */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 font-bold text-neon-red neon-text">
          12
        </div>
        
        {/* Clock numbers */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 font-bold">6</div>
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 font-bold">3</div>
        <div className="absolute left-10 top-1/2 transform -translate-y-1/2 font-bold">9</div>
      </div>
      
      {/* Digital readout */}
      <div className="text-center mb-4">
        <p className="text-2xl md:text-3xl font-bold neon-text-orange">
          Current Setting: {digitalSeconds} Seconds to Midnight
        </p>
      </div>
      
      {/* Optional slider for demo */}
      <div className="w-full max-w-md mx-auto mb-6">
        <label htmlFor="clock-slider" className="block text-sm mb-2 text-center">
          Adjust for demo
        </label>
        <input
          id="clock-slider"
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={minutesToMidnight}
          onChange={(e) => onClockAdjust(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          aria-label="Adjust the Doomsday Clock time to midnight"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>Close to midnight</span>
          <span>Further from midnight</span>
        </div>
      </div>
      
      {/* Learn More button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition focus:outline-none focus:ring-2 focus:ring-neon-red"
        aria-label="Learn more about the Doomsday Clock"
      >
        [Learn More]
      </button>
      
      {/* Modal */}
      {showModal && (
        <ClockModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default DoomsdayClock
