import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async (session) => {
      if (!session?.user) {
        if (isMounted) {
          setAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        // Query the admin_users table. 
        // Our new RLS policy "Authenticated users can check administrative status" allows this read.
        // It returns rows ONLY if the policy public.is_admin() or similar logic allows it, BUT 
        // to be absolutely safe and clear, we explicitly check if the user's email exists as an active admin.
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('email', session.user.email)
          .eq('active', true)
          .single();

        if (error || !data || data.role !== 'admin') {
          if (isMounted) setAuthenticated(false);
        } else {
          if (isMounted) setAuthenticated(true);
        }
      } catch (err) {
        console.error("Error verifying admin status:", err);
        if (isMounted) setAuthenticated(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminStatus(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       checkAdminStatus(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    }
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
