import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { Lock, User, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
    }

    try {
        // Enforce ONLY the specific admin email
        if (formData.email !== 'awinashkr31@gmail.com') {
            throw new Error("This registration portal is restricted to authorized administrators only.");
        }

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (error) throw error;

        // If successful, guide them to the next step
        navigate('/sadmin/login');
        alert("Account created! Now run the 'confirm_email.sql' script in Supabase to activate it.");

    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfbf7] font-body">
      {/* Visual Side (Left) */}
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
                        Admin Setup
                    </span>
                </div>
                <h1 className="text-5xl font-heading leading-tight mb-6">
                    Initialize Your <span className="text-rose-200 italic font-serif">Command Center</span>.
                </h1>
                <p className="text-lg text-stone-300 max-w-md leading-relaxed">
                    Create your master administrator account to begin managing the platform.
                </p>
            </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[420px] space-y-8 animate-in slide-in-from-right-8 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-heading text-stone-900 mb-2">Create Admin Account</h2>
            <p className="text-stone-500">Restricted access. Authorized personnel only.</p>
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
                        Admin Email
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
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                    </div>
                </div>

                {/* Password Input */}
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                        Password
                    </label>
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

                {/* Confirm Password Input */}
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-11 pr-11 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                            placeholder="••••••••"
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
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
                        Create Admin Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
          </form>

          <Link to="/sadmin/login" className="block text-center text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors">
              Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
