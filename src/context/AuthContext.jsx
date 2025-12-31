import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { supabase } from '../config/supabase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function confirmReset(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

  function verifyEmail(user) {
    return sendEmailVerification(user);
  }



  function setupRecaptcha(containerId) {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        }
      });
    }
    return window.recaptchaVerifier;
  }

  function sendOtp(phoneNumber) {
    return signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  }

  const syncUserToSupabase = async (user, additionalData = {}) => {
    if (!user) return;
    try {
        const { error } = await supabase
            .from('users')
            .upsert({ 
                firebase_uid: user.uid,
                email: user.email,
                display_name: user.displayName,
                photo_url: user.photoURL,
                phone_number: additionalData.phone || null,
                provider: user.providerData[0]?.providerId || 'email',
                last_login: new Date().toISOString()
            }, { onConflict: 'email' });
        
        if (error) console.error('Error syncing user to Supabase:', error);
    } catch (err) {
        console.error('Error in user sync:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) await syncUserToSupabase(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    login,
    signup,
    logout,
    resetPassword,
    confirmReset,
    verifyEmail,
    updateUser: async (name, photoURL, phone) => {
        await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL
        });
        // Sync again after update
        await syncUserToSupabase(auth.currentUser, { phone });
    },
    setupRecaptcha,
    sendOtp
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
