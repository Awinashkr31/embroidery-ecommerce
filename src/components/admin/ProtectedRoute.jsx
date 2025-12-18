import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // DEV BYPASS CHECK
      const bypass = localStorage.getItem('admin_dev_bypass') === 'true';
      setAuthenticated(!!session || bypass);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       const bypass = localStorage.getItem('admin_dev_bypass') === 'true';
       setAuthenticated(!!session || bypass);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
