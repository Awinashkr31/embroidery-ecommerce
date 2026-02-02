import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  sendPasswordResetEmail,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUser = (displayName, photoURL) => {
     // Note: phoneNumber cannot be simply updated via updateProfile in Firebase without verification.
     // We invoke updateProfile for displayName and photoURL.
     return updateProfile(auth.currentUser, {
         displayName: displayName,
         photoURL: photoURL
     });
  };

  const verifyEmail = (user) => {
      return sendEmailVerification(user);
  };

  const signInWithGoogle = () => {
      return signInWithPopup(auth, googleProvider);
  };
  
  const resetPassword = (email) => {
      return sendPasswordResetEmail(auth, email);
  };

  const updateEmail = (email) => {
      return firebaseUpdateEmail(currentUser, email);
  };

  const updatePassword = (password) => {
      return firebaseUpdatePassword(currentUser, password);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateUser,
    verifyEmail,
    signInWithGoogle,
    resetPassword,
    updateEmail,
    updatePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
