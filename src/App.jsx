import { useState } from 'react'
import Header from './components/Header'
import DoomsdayClock from './components/DoomsdayClock'
import ChatWindow from './components/ChatWindow'
import Footer from './components/Footer'

function App() {
  // Default value is 90 seconds to midnight (1.5 minutes)
  const [minutesToMidnight, setMinutesToMidnight] = useState(1.5)
  const [digitalSeconds, setDigitalSeconds] = useState(90)
  
  // Update both values when the slider is changed
  const handleClockAdjust = (value) => {
    setMinutesToMidnight(value)
    setDigitalSeconds(value * 60)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8 gap-10 max-w-4xl mx-auto w-full">
        <DoomsdayClock 
          minutesToMidnight={minutesToMidnight} 
          digitalSeconds={digitalSeconds}
          onClockAdjust={handleClockAdjust}
        />
        
        <ChatWindow />
      </main>
      
      <Footer />
    </div>
  )
}

export default App
