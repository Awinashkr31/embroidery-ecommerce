import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function Login() {
  const { signInWithGoogle, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const userCredential = await login(email, password);
      
      if (!userCredential.user.emailVerified) {
        await logout();
        setError('Please verify your email address to log in.');
        setLoading(false);
        return; 
      }

      navigate('/');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615561021463-569d643806a6?q=80&w=1920')] bg-cover bg-center opacity-60 mix-blend-overlay animate-in fade-in duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-rose-950/20 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full">
            <div className="mb-8">
                <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
                    Handcrafted Luxury
                </span>
                <h1 className="text-5xl font-heading leading-tight mb-6">
                    Where Tradition <br/> Meets <span className="italic font-serif text-rose-200">Elegance</span>.
                </h1>
                <p className="text-lg text-rose-100/80 max-w-md leading-relaxed">
                    Join our community of art lovers. Discover exclusive hand-embroidered collections tailored just for you.
                </p>
            </div>
            <div className="flex gap-2">
                <div className="h-1 w-12 bg-white rounded-full"></div>
                <div className="h-1 w-2 bg-white/30 rounded-full"></div>
                <div className="h-1 w-2 bg-white/30 rounded-full"></div>
            </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
         {/* Decorative Element */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg width="200" height="200" viewBox="0 0 100 100" className="fill-current text-rose-900">
                <path d="M50 0 L100 50 L50 100 L0 50 Z" />
            </svg>
        </div>

        <div className="w-full max-w-[420px] space-y-8 animate-in slide-in-from-right-8 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-heading text-stone-900 mb-3">Welcome Back</h2>
            <p className="text-stone-500">Please enter your details to access your account.</p>
          </div>

          {successMessage && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{successMessage}</p>
            </div>
          )}

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
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                            placeholder="name@example.com"
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                    </div>
                </div>

                {/* Password Input */}
                <div className="group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 group-focus-within:text-rose-900 transition-colors">
                            Password
                        </label>
                        <Link to="/forgot-password" className="text-xs font-medium text-rose-900 hover:text-rose-700 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>

          <p className="text-center text-stone-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-rose-900 hover:text-rose-700 transition-colors">
                Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
