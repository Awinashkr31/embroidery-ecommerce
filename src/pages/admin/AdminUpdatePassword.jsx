import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const AdminUpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if we are in a valid recovery session
  useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
             // If no session, they might have lost the link context, usually specific to flow
             // But updatePassword works if the link logged them in. 
             // Supabase magic link logs the user in automatically.
             // If not logged in, we can't update.
             setError("Invalid or expired reset link. Please try again.");
          }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
    }

    try {
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) throw error;

        alert("Password updated successfully! Redirecting to login...");
        await supabase.auth.signOut(); // Force re-login with new password
        navigate('/sadmin/login');

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] font-body p-6">
       <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
          <h2 className="text-2xl font-heading font-bold text-stone-900 mb-2">Set New Password</h2>
          <p className="text-stone-500 text-sm mb-6">Secure your admin account.</p>

          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">New Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-900"
                        placeholder="••••••••"
                        minLength={6}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
             </div>

             <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-900"
                        placeholder="••••••••"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                </div>
             </div>

             <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-rose-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {loading ? 'Updating...' : <>Update Password <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
       </div>
    </div>
  );
};

export default AdminUpdatePassword;
