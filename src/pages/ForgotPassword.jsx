import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for password reset instructions');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col bg-gradient-to-br from-warm-beige via-rose-gold/20 to-sage/20">
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-rose-gold/20 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-deep-rose" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>}

          {message && <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-deep-rose focus:border-deep-rose outline-none sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-deep-rose hover:bg-deep-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-rose transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Send className="h-5 w-5 text-white/50 group-hover:text-white" />
              </span>
              Reset Password
            </button>
          </form>

          <div className="text-center mt-4">
             <Link to="/login" className="flex items-center justify-center text-sm font-medium text-deep-rose hover:text-deep-rose/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
