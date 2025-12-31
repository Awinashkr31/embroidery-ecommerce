import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function ResetPassword() {
  const { confirmReset } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Firebase sends the code in the 'oobCode' query parameter
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode'); // 'resetPassword'

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!oobCode) {
        setError("Invalid password reset link. Please request a new one.");
    }
  }, [oobCode]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await confirmReset(oobCode, password);
      // Success - Redirect to login with specific state/message
      navigate('/login', { state: { message: "Password has been reset successfully. Please log in." } });
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setLoading(false);
    }
  }

  if (!oobCode && !error) return null; // Or some loading state

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-4 font-body">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading text-stone-900 mb-2">Set New Password</h2>
          <p className="text-stone-500">Create a strong password for your account.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-medium">
            {error}
          </div>
        )}

        {oobCode && !error && (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1">
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
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 hover:bg-rose-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-stone-900/10 hover:shadow-rose-900/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {loading ? 'Updating...' : <>Update Password <ArrowRight className="w-4 h-4" /></>}
            </button>
            </form>
        )}
      </div>
    </div>
  );
}
