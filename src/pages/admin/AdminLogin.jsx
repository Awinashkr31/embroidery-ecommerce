import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { Lock, User, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // SECURITY CHECK: Verify if the user is actually the admin
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
      if (data.user?.email !== adminEmail) {
          // Identify theft/Customer login attempt -> Kick them out
          await supabase.auth.signOut();
          throw new Error('Unauthorized Access: This area is for Administrators only.');
      }
      
      
      // Successful login
      navigate('/sadmin/dashboard');
    } catch (err) {
      if (err.message.includes('Email not confirmed')) {
          setError('Email not confirmed. Please run the "confirm_email.sql" script in Supabase.');
      } else {
          setError(err.message || 'Failed to login');
      }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfbf7] font-body">
      {/* Visual Side (Left) - Darker/More Serious for Admin */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617327918451-382a17688ed9?q=80&w=1920')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full">
            <div className="mb-8 animate-in slide-in-from-left-10 duration-1000">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                        <ShieldCheck className="w-6 h-6 text-rose-200" />
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-300">
                        Admin Portal
                    </span>
                </div>
                <h1 className="text-5xl font-heading leading-tight mb-6">
                    Manage Your <span className="text-rose-200 italic font-serif">Masterpiece</span>.
                </h1>
                <p className="text-lg text-stone-300 max-w-md leading-relaxed">
                    Secure access for store management, order processing, and content updates.
                </p>
            </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
         {/* Decorative Background Icon */}
        <div className="absolute top-10 right-10 opacity-5">
             <ShieldCheck width="120" height="120" className="text-stone-900" />
        </div>

        <div className="w-full max-w-[420px] space-y-8 animate-in slide-in-from-right-8 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-heading text-stone-900 mb-2">Admin Sign In</h2>
            <p className="text-stone-500">Enter your credentials to access the dashboard.</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
                {/* Email Input */}
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                        Email Address
                    </label>
                    <div className="relative">
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                            placeholder="admin@company.com"
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                    </div>
                </div>

                {/* Password Input */}
                <div className="group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 group-focus-within:text-rose-900 transition-colors">
                            Password
                        </label>
                        <Link to="/sadmin/forgot-password" className="text-xs font-medium text-rose-900 hover:text-rose-700 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-11 pr-11 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                            placeholder="••••••••"
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 hover:bg-rose-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-stone-900/10 hover:shadow-rose-900/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        Access Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
          </form>

          <div className="space-y-4 text-center">
              <Link to="/sadmin/register" className="block text-xs font-bold uppercase tracking-widest text-rose-900 hover:text-rose-700 transition-colors">
                  Create Admin Account
              </Link>
              <Link to="/" className="block text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors">
                  Back to Store
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
