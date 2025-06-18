import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, twitterProvider, isDevelopment } from '../config/firebase';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign in with X (Twitter)
  const signInWithX = async () => {
    try {
      setError(null);
      console.log("Starting Twitter authentication process");
      
      // Use mock user in development mode if Firebase is not configured
      if (isDevelopment) {
        console.log("Using mock Twitter authentication in development mode");
        const mockUser = {
          uid: "mock-user-123",
          displayName: "Demo User",
          email: "demo@example.com",
          photoURL: "https://via.placeholder.com/150",
          reloadUserInfo: {
            screenName: "nukeintelfan"
          },
          providerData: [
            {
              providerId: "twitter.com",
              uid: "mock-twitter-123",
              displayName: "Demo User",
              photoURL: "https://via.placeholder.com/150",
              email: "demo@example.com"
            }
          ]
        };
        
        // Simulate auth state change
        setCurrentUser(mockUser);
        console.log("Mock authentication successful");
        return { user: mockUser };
      }
      
      // Real authentication in production
      console.log("Attempting Twitter popup authentication");
      const result = await signInWithPopup(auth, twitterProvider);
      console.log("Twitter authentication successful", result);
      
      // Immediately set the user to avoid race conditions with the auth state observer
      setCurrentUser(result.user);
      
      // Return the user credential
      return result;
    } catch (error) {
      console.error("Error signing in with X:", error);
      // More detailed error logging
      if (error.code) {
        console.error(`Error code: ${error.code}`);
      }
      if (error.customData) {
        console.error("Error custom data:", error.customData);
      }
      
      setError(error.message || "Authentication failed");
      return null;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      setError(error.message);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    signInWithX,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
