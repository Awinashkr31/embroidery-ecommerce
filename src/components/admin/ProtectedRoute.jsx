import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // 1. Check if Supabase Session exists
      // 2. Check if Email is Admin (Strict)
      // 3. OR Check Dev Bypass (Dev Mode)
      
      const userEmail = session?.user?.email;
      
      const isAdmin = (session && userEmail === 'awinashkr31@gmail.com');

      // STRICT CHECK: Session MUST exist and be the admin email.
      setAuthenticated(isAdmin);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       const userEmail = session?.user?.email;
       const isAdmin = (session && userEmail === 'awinashkr31@gmail.com');
       
       setAuthenticated(isAdmin);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/sadmin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
