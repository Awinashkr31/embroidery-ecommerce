import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { getAuthErrorMessage } from '../utils/authErrors';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { signup, updateUser, verifyEmail, logout, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      const { user } = await signup(formData.email, formData.password);
      await updateUser(formData.name, null, formData.phone);
      await verifyEmail(user);
      await logout();
      
      addToast('Account created! Verification email sent.', 'success');
      
      navigate('/login', { 
        state: { 
          message: "Account created! We've sent a verification link to your email. Please verify your email before logging in." 
        } 
      });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
    setLoading(false);
  }

  async function handleGoogleSignUp() {
    try {
      setError('');
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(getAuthErrorMessage(err));
    }
  }

  return (
    <div className="min-h-screen flex bg-[#fdfbf7] font-body">
      {/* Visual Side (Left) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-rose-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546167889-0b4b5ff0afd0?q=80&w=1920')] bg-cover bg-center opacity-50 mix-blend-overlay animate-in zoom-in-105 duration-[20s]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-rose-950/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full">
            <div className="mb-8">
                <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
                    Be Part of the Story
                </span>
                <h1 className="text-5xl font-heading leading-tight mb-6">
                    Crafting Memories, <span className="italic font-serif text-rose-200">One Stitch</span> at a Time.
                </h1>
                <p className="text-lg text-rose-100/80 max-w-md leading-relaxed">
                    Create an account to curate your wishlist, track custom orders, and receive exclusive offers on new arrivals.
                </p>
            </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
         {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 p-8 opacity-5 rotate-180">
            <svg width="150" height="150" viewBox="0 0 100 100" className="fill-current text-rose-900">
                <circle cx="50" cy="50" r="50" />
            </svg>
        </div>

        <div className="w-full max-w-[480px] space-y-8 animate-in slide-in-from-bottom-8 duration-700 py-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-heading text-stone-900 mb-3">Create Account</h2>
            <p className="text-stone-500">Join our community today.</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                        Full Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                            placeholder="Sana Khan"
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                    </div>
                </div>

                {/* Phone */}
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                        Phone
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                            placeholder="+91..."
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                    Email Address
                </label>
                <div className="relative">
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                        placeholder="name@example.com"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full pl-11 pr-11 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                            placeholder="••••••••"
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                className="w-full bg-stone-900 hover:bg-rose-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-stone-900/10 hover:shadow-rose-900/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 mt-4 disabled:pointer-events-none"
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-stone-400">
                <span className="bg-[#fdfbf7] px-4">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignUp}
            className="w-full bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span>Sign up with Google</span>
          </button>

          <p className="text-center text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-rose-900 hover:text-rose-700 transition-colors">
                Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
