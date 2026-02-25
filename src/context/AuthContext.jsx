import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unified Logout
  const logout = async () => {
    try {
        await supabase.auth.signOut();
        setCurrentUser(null);
    } catch (error) {
        console.error("Logout Error:", error);
    }
  };

  const updateUser = async (displayName, photoURL) => {
     const updates = {};
     if (displayName) updates.full_name = displayName;
     if (photoURL) updates.avatar_url = photoURL; 

     const { data, error } = await supabase.auth.updateUser({
         data: updates
     });
     
     if (error) throw error;
     
     // Update local state immediately
     setCurrentUser(prev => ({
         ...prev,
         user_metadata: {
             ...prev?.user_metadata,
             ...updates
         }
     }));
     
     return data;
  };

  useEffect(() => {
    let supabaseSubscription;

    const initAuth = async () => {
        // Initial session check
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            setCurrentUser(session.user);
        } else {
            setCurrentUser(null);
        }
        setLoading(false);

        // Listen for Supabase Auth Changes
        const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setCurrentUser(session.user);
            } else {
                setCurrentUser(null);
            }
        });
        supabaseSubscription = data.subscription;
    };

    initAuth();

    return () => {
        if (supabaseSubscription) supabaseSubscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
               // Optional: redirect URL if needed, usually Supabase handles the default platform URL
               // redirectTo: window.location.origin
            }
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Supabase Google Sign In Error:", error);
        throw error;
      }
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

