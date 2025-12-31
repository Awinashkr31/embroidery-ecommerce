import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setMessage('');

      try {
          // SECURITY: Only allow the Master Admin email
          if (email !== 'awinashkr31@gmail.com') {
              throw new Error("Invalid admin email provided.");
          }

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/sadmin/update-password`,
          });

          if (error) throw error;

          setMessage('Password reset instructions sent. Check your email.');
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfbf7] font-body">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617327918451-382a17688ed9?q=80&w=1920')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full">
            <h1 className="text-4xl font-heading leading-tight mb-4">
               Recovery <span className="text-rose-200">Mode</span>.
            </h1>
            <p className="text-stone-300 max-w-md">Secure password reset for administrators.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[400px] space-y-8 animate-in slide-in-from-right-8 duration-700">
          <Link to="/sadmin/login" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Login
          </Link>

          <div>
            <h2 className="text-3xl font-heading text-stone-900 mb-2">Forgot Password?</h2>
            <p className="text-stone-500 text-sm">Enter your admin email to receive a secure reset link.</p>
          </div>

          {message && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-rose-900 transition-colors">
                    Admin Email
                </label>
                <div className="relative">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/10 focus:border-rose-900 transition-all font-medium text-stone-800 placeholder-stone-400"
                        placeholder="admin@company.com"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 hover:bg-rose-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-stone-900/10 hover:shadow-rose-900/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
            >
                {loading ? <span className="animate-spin text-xl">•</span> : <>Send Reset Link <Send className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
