import React, { createContext, useContext, useState, useEffect } from 'react';
// Firebase imports removed or kept only if strictly needed for specific legacy features temporarily.
// import { auth, googleProvider } from '../config/firebase'; 
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Legacy Firebase Wrappers (Optional: you can keep them if you want to support legacy users or migrate slowly, 
  // but for "Unified" goal, strict replacement is better. 
  // We will stub them or remove them.)

  const logout = async () => {
    return supabase.auth.signOut();
  };

  const updateUser = async (displayName, photoURL) => {
     // Supabase specific update
     const updates = {};
     if (displayName) updates.full_name = displayName;
     if (photoURL) updates.avatar_url = photoURL; // Supabase uses avatar_url usually in metadata

     const { data, error } = await supabase.auth.updateUser({
         data: updates
     });
     if (error) throw error;
     return data;
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
              redirectTo: window.location.origin // Redirect back to home/current page
          }
      });
      if (error) throw error;
      return data;
  };
    
  // Supabase OTP Functions
  const loginWithOtp = async (email) => {
      return supabase.auth.signInWithOtp({ email });
  };

  const verifyOtp = async (email, token) => {
      return supabase.auth.verifyOtp({
          email,
          token,
          type: 'email'
      });
  };

  const value = {
    currentUser,
    logout,
    updateUser,
    signInWithGoogle,
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
