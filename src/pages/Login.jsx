import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
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
      // Clear state so message doesn't persist on refresh (optional but good UX)
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
        // If email is not verified, logout and show error
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
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-deep-rose">
        <img 
            src="/auth-side-image.png" 
            alt="Artistic Hand Embroidery" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
            <h1 className="text-4xl font-serif font-bold mb-4">Weaving Stories in Thread.</h1>
            <p className="text-lg opacity-90 max-w-md">Experience the blend of tradition and contemporary fashion with our handcrafted embroidery.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white py-12 lg:py-0">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          <div className="text-center lg:text-left">
             {/* Mobile Logo or Heading could go here if needed, keeping it simple for now */}
            <h2 className="text-3xl font-bold text-gray-900 font-serif">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in
            </p>
          </div>
          
          {successMessage && <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>}

          {error && <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-deep-rose transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-deep-rose focus:border-deep-rose outline-none transition-all"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-deep-rose transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-deep-rose focus:border-deep-rose outline-none transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                    <Link to="/forgot-password" className="text-sm font-medium text-deep-rose hover:text-deep-rose/80">
                        Forgot Password?
                    </Link>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-deep-rose hover:bg-deep-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-rose transition-all duration-300 transform hover:scale-[1.01] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/60"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
          >
            <img 
                className="h-5 w-5 mr-3" 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google logo" 
            />
            Sign in with Google
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-deep-rose hover:text-deep-rose/80 transition-colors">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
