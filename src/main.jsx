import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './emergency-styles.css' // Emergency fix for black screen issue
import { AuthProvider } from './contexts/AuthContext'
import { QueryClient, QueryClientProvider } from 'react-query'

// Initialize React Query client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
