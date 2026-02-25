import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unified Logout
  const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
  };

  const updateUser = async (displayName, photoURL) => {
     if (!auth.currentUser) throw new Error("No user logged in");
     const updates = {};
     if (displayName) updates.displayName = displayName;
     if (photoURL) updates.photoURL = photoURL; 

     await updateProfile(auth.currentUser, updates);
     
     // Update local state immediately
     setCurrentUser(prev => ({
         ...prev,
         ...updates
     }));
     
     return auth.currentUser;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // Map the firebase user properties to what the app expects.
            // Some parts of the app might expect user.id instead of user.uid
            setCurrentUser({
                ...user,
                id: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                user_metadata: {
                    full_name: user.displayName,
                    avatar_url: user.photoURL,
                }
            });
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result;
      } catch (error) {
        console.error("Firebase Google Sign In Error:", error);
        throw error;
      }
  };
    
  const signup = async (email, password) => {
      return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
      return signInWithEmailAndPassword(auth, email, password);
  };

  const resetPassword = async (email) => {
      return sendPasswordResetEmail(auth, email);
  };

  const confirmReset = async (code, password) => {
      return confirmPasswordReset(auth, code, password);
  };

  // Keep these as placeholders in case any component imports them to avoid crashing
  const loginWithOtp = async () => {
      throw new Error("OTP Login is not supported with Firebase Email/Password auth currently.");
  };

  const verifyOtp = async () => {
      throw new Error("OTP Login is not supported with Firebase Email/Password auth currently.");
  };

  const value = {
    currentUser,
    logout,
    updateUser,
    signInWithGoogle,
    signup,
    login,
    resetPassword,
    confirmReset,
    loginWithOtp,
    verifyOtp,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

