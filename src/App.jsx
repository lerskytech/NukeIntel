import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import Header from './components/Header'
import DoomsdayClock from './components/DoomsdayClock'
import NewsWidget from './components/NewsWidget'
import SocialIntelPanel from './components/SocialIntelPanel'
import Footer from './components/Footer'

// Configuration moved to main.jsx

function App() {
  // Track if page has been loaded (for animations)
  const [pageLoaded, setPageLoaded] = useState(false)
  
  useEffect(() => {
    // Trigger animations after initial load
    setPageLoaded(true)
  }, [])

  return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white relative overflow-hidden" style={{backgroundColor: '#0a0a0a'}}>
        <Helmet>
          <title>NukeIntel - Real-Time Global Threat Tracker</title>
          <meta name="description" content="Track global nuclear threats in real-time and monitor risks including weapons proliferation, climate change, and disruptive technologies." />
          <meta property="og:title" content="NukeIntel - Real-Time Global Threat Tracker" />
          <meta property="og:description" content="Live updates on how close we are to global catastrophe, according to the Bulletin of Atomic Scientists." />
          <meta name="theme-color" content="#0a0a0a" />
        </Helmet>
        
        {/* Background grid pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10" 
          style={{ 
            backgroundImage: 'url(/src/assets/grid.svg)', 
            backgroundSize: '50px 50px',
            backgroundRepeat: 'repeat',
            zIndex: 0
          }}
        />

        <Header />
        
        <motion.main 
          className="flex-grow flex flex-col items-center justify-start px-4 py-8 gap-8 max-w-5xl mx-auto w-full z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: pageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.2 }}
        >
          <DoomsdayClock />
          
          <NewsWidget />
          
          <SocialIntelPanel />
        </motion.main>
        
        <Footer />
      </div>
  )
}

export default App
