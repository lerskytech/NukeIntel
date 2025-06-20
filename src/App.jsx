import { useState, useEffect, Component } from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import Header from './components/Header'
import DoomsdayClock from './components/DoomsdayClock'
import LiveFeed from './components/LiveFeed'
import NewsWidget from './components/NewsWidget'
import Footer from './components/Footer'
import DomainForSale from './components/DomainForSale'
// Weather panel and HighAlertFeed removed as requested
import WindyWebcamView from './components/WindyWebcamView'
import BulletproofWindyWebcams from './components/BulletproofWindyWebcams'

// Error Boundary Component to catch rendering errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error information
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={{ padding: '20px', backgroundColor: '#111', color: 'white', minHeight: '100vh' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
            <summary>Error Details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Configuration moved to main.jsx

function App() {
  // Track if page has been loaded (for animations)
  const [pageLoaded, setPageLoaded] = useState(false)
  // Track if we're viewing a shared webcam
  const [sharedWebcamId, setSharedWebcamId] = useState(null)
  
  useEffect(() => {
    // Trigger animations after initial load
    setPageLoaded(true)
    
    // Check URL for webcam sharing parameters
    const urlParams = new URLSearchParams(window.location.search)
    const webcamId = urlParams.get('webcam')
    if (webcamId) {
      setSharedWebcamId(webcamId)
      // Update document title for shared webcam
      document.title = 'NukeIntel - Shared Webcam'
    }
  }, [])
  
  // Handle closing the shared webcam view
  const handleBackFromWebcam = () => {
    setSharedWebcamId(null)
    // Clear URL parameters
    window.history.pushState({}, '', '/')
    // Reset document title
    document.title = 'NukeIntel - Real-Time Global Threat Tracker'
  }

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
        
        {sharedWebcamId ? (
          // Display shared webcam view when webcam parameter is present
          <motion.main 
            className="flex-grow px-4 py-8 max-w-5xl mx-auto w-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: pageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <WindyWebcamView shareId={sharedWebcamId} onBack={handleBackFromWebcam} />
          </motion.main>
        ) : (
          // Display normal app content
          <motion.main 
            className="flex-grow flex flex-col items-center justify-start px-4 py-8 gap-8 max-w-5xl mx-auto w-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: pageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.2 }}
          >
            <DoomsdayClock />
            
            <DomainForSale />
            
            <div className="w-full">
              <LiveFeed />
            </div>
            
            <NewsWidget />
            
            <div className="w-full">
              <BulletproofWindyWebcams />
            </div>
          </motion.main>
        )}
        
        <Footer />
      </div>
  )
}

export default App
