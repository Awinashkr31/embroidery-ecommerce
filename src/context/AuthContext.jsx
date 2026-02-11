import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase'; 
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unified Logout
  const logout = async () => {
    try {
        await firebaseSignOut(auth); // Sign out from Firebase
        await supabase.auth.signOut(); // Sign out from Supabase
        setCurrentUser(null);
    } catch (error) {
        console.error("Logout Error:", error);
    }
  };

  const updateUser = async (displayName, photoURL) => {
     if (auth.currentUser) {
         // Firebase Update
         await updateProfile(auth.currentUser, {
             displayName: displayName,
             photoURL: photoURL
         });

         // Update local state immediately
         setCurrentUser(prev => ({
             ...prev,
             displayName: displayName,
             photoURL: photoURL,
             user_metadata: {
                 ...prev?.user_metadata,
                 full_name: displayName,
                 avatar_url: photoURL
             }
         }));
         return;
     }

     // Supabase specific update (Admin only mostly)
     const updates = {};
     if (displayName) updates.full_name = displayName;
     if (photoURL) updates.avatar_url = photoURL; 

     const { data, error } = await supabase.auth.updateUser({
         data: updates
     });
     if (error) throw error;
     return data;
  };

  useEffect(() => {
    let firebaseUnsubscribe;
    let supabaseSubscription;

    const initAuth = async () => {
        // 1. Check Supabase Session (Priority: Admin)
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        if (supabaseSession?.user) {
            console.log("Auth: Supabase Session Found (Admin)", supabaseSession.user.email);
            setCurrentUser(supabaseSession.user);
            setLoading(false);
        }

        // 2. Listen for Firebase Auth Changes (User)
        firebaseUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log("Auth: Firebase User Found", firebaseUser.email);
                // Map Firebase user to a structure compatible with our app
                setCurrentUser({
                    ...firebaseUser,
                    id: firebaseUser.uid, 
                    email: firebaseUser.email,
                    user_metadata: {
                        full_name: firebaseUser.displayName,
                        avatar_url: firebaseUser.photoURL
                    },
                    app_metadata: { provider: 'google' } 
                });
                setLoading(false);
            } else {
                // If no Firebase user, check if we still have a Supabase session
                // If neither, then user is null
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                     setCurrentUser(null);
                }
                setLoading(false);
            }
        });

        // 3. Listen for Supabase Auth Changes
        const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                console.log("Auth: Supabase Auth Changed -> User Logged In");
                setCurrentUser(session.user);
                // If Supabase logs in, we might want to ensure Firebase is ignored or signOut? 
                // For now, Supabase (Admin) takes precedence in UI logic usually
            } else {
                // Check Firebase
                if (!auth.currentUser) {
                    setCurrentUser(null);
                }
            }
        });
        supabaseSubscription = data.subscription;
    };

    initAuth();

    return () => {
        if (firebaseUnsubscribe) firebaseUnsubscribe();
        if (supabaseSubscription) supabaseSubscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
      // Use Firebase for Google Sign In
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return user;
      } catch (error) {
        console.error("Firebase Google Sign In Error:", error);
        throw error;
      }
  };
    
  // Supabase OTP Functions (Keep for Admin/Legacy)
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
