import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { getAuthErrorMessage } from '../utils/authErrors';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { signup, updateUser, verifyEmail, logout } = useAuth();
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
      
      // Create account
      const { user } = await signup(formData.email, formData.password);
      
      // Save name and phone to profile & database
      await updateUser(formData.name, null, formData.phone);
      
      // Send verification email
      await verifyEmail(user);

      // Logout the user immediately so they can't access the app without verifying
      // Logout the user immediately so they can't access the app without verifying
      await logout();
      
      // Show success toast
      addToast('Account created! Verification email sent.', 'success');
      
      // Redirect to login with success message
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
            <h1 className="text-4xl font-serif font-bold mb-4">Join Our Community.</h1>
            <p className="text-lg opacity-90 max-w-md">Create an account to track your orders, manage your wishlist, and enjoy a personalized shopping experience.</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white py-12 lg:py-0">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us today for exclusive access
            </p>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-deep-rose transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-deep-rose focus:border-deep-rose outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-deep-rose transition-colors" />
                  </div>
                  <input
                    type="tel"
                    required
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-deep-rose focus:border-deep-rose outline-none transition-all"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                    <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-deep-rose transition-colors" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-deep-rose focus:border-deep-rose outline-none transition-all"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-deep-rose hover:bg-deep-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-rose transition-all duration-300 transform hover:scale-[1.01] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-deep-rose hover:text-deep-rose/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
