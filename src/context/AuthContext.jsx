import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { auth, googleProvider } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);

  const openLoginSheet = useCallback(() => setIsLoginSheetOpen(true), []);
  const closeLoginSheet = useCallback(() => setIsLoginSheetOpen(false), []);

  useEffect(() => {
    // 1. Firebase Auth Listener (For regular users)
    const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        try {
          await supabase.from('users').upsert({
            firebase_uid: user.uid,
            email: user.email,
            display_name: user.displayName || '',
            photo_url: user.photoURL || '',
            provider: user.providerData?.[0]?.providerId || 'email',
            last_login: new Date().toISOString()
          }, { onConflict: 'firebase_uid' }).select();
        } catch (e) {
          console.error("Failed to sync user to Supabase:", e);
        }
      }
    });

    // 2. Supabase Auth Listener (For Admin users)
    let supabaseSubscription;
    const initSupabaseAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setAdminUser(session?.user || null);

        const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setAdminUser(session?.user || null);
        });
        supabaseSubscription = data.subscription;
    };
    initSupabaseAuth();

    return () => {
        unsubscribeFirebase();
        if (supabaseSubscription) supabaseSubscription.unsubscribe();
    };
  }, []);

  // --- FIREBASE USER FUNCTIONS ---
  const signup = useCallback(async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const login = useCallback(async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return signInWithPopup(auth, googleProvider);
  }, []);

  const updateUser = useCallback(async (displayName, photoURL, phoneNumber) => {
    if (!auth.currentUser) return;
    
    // Firebase updateProfile handles basic info
    await updateProfile(auth.currentUser, {
       displayName: displayName || auth.currentUser.displayName,
       photoURL: photoURL || auth.currentUser.photoURL
    });

    // Update local state to reflect changes instantly
    setCurrentUser({ ...auth.currentUser });
    return auth.currentUser;
  }, []);

  // --- SUPABASE ADMIN FUNCTIONS ---
  const loginWithOtp = useCallback(async (email) => {
      return supabase.auth.signInWithOtp({ email });
  }, []);

  const verifyOtp = useCallback(async (email, token) => {
      return supabase.auth.verifyOtp({ email, token, type: 'email' });
  }, []);

  // --- UNIFIED LOGOUT ---
  const logout = useCallback(async () => {
    try {
        await firebaseSignOut(auth);
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Logout Error:", error);
    }
  }, []);

  const value = useMemo(() => ({
    currentUser,
    adminUser,
    signup,
    login,
    signInWithGoogle,
    updateUser,
    logout,
    loginWithOtp,
    verifyOtp,
    loading,
    isLoginSheetOpen,
    openLoginSheet,
    closeLoginSheet
  }), [
    currentUser, 
    adminUser, 
    loading, 
    isLoginSheetOpen,
    signup,
    login,
    signInWithGoogle,
    updateUser,
    logout,
    loginWithOtp,
    verifyOtp,
    openLoginSheet,
    closeLoginSheet
  ]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
