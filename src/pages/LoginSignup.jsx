import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { AlertTriangle, Sparkles, Shield, Truck, RefreshCw, ChevronLeft } from 'lucide-react';

const PERKS = [
  { icon: Sparkles, text: 'Exclusive member-only deals' },
  { icon: Truck,    text: 'Free shipping on orders ₹999+' },
  { icon: Shield,   text: 'Easy 7-day returns' },
  { icon: RefreshCw,text: 'Real-time order tracking' },
];

const LoginSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError('Could not sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login · Enbroidery" description="Sign in to your Enbroidery account." />

      {/* ════════════════════════════════════════
          MOBILE layout  (hidden on lg+)
      ════════════════════════════════════════*/}
      <div className="lg:hidden min-h-screen flex flex-col bg-white">

        {/* ── Branded top section ── */}
        <div className="relative bg-stone-900 pt-14 pb-20 px-6 flex flex-col items-center overflow-hidden">
          {/* Glow blobs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-rose-900/50 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-rose-800/30 blur-[50px] pointer-events-none" />

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm font-medium z-10"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Title (no logo here — shown in white card instead) */}
          <h1 className="relative z-10 text-2xl font-heading font-bold text-white text-center leading-snug mb-2">
            Welcome back 👋
          </h1>
          <p className="relative z-10 text-stone-400 text-sm text-center max-w-xs">
            Sign in to track orders, save favourites &amp; get exclusive deals.
          </p>
        </div>

        {/* ── White card — overlaps top section ── */}
        <div className="flex-1 bg-white rounded-t-3xl -mt-6 px-6 pt-7 pb-10 z-10 relative shadow-[0_-4px_30px_rgba(0,0,0,0.08)]">

          {/* Logo in full color on white background */}
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img src="/logo.png" alt="Enbroidery" className="h-14 w-auto object-contain" />
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          )}

          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest text-center mb-4">
            Sign in with
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full rounded-2xl py-4 px-5 flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-60 active:scale-[0.98] shadow-lg shadow-blue-500/20 font-bold text-white text-sm" style={{background: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)'}} onMouseOver={e=>e.currentTarget.style.opacity='0.92'} onMouseOut={e=>e.currentTarget.style.opacity='1'}
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5 shrink-0 bg-white rounded-full p-0.5"
                alt=""
              />
            )}
            <span className="font-bold text-white text-sm">
              {loading ? 'Signing in…' : 'Continue with Google'}
            </span>
          </button>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <Shield className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs text-stone-500 font-medium">Protected by Google OAuth 2.0</span>
          </div>

          {/* Perks */}
          <div className="mt-8 p-4 bg-stone-50 rounded-2xl space-y-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-rose-900" />
                </div>
                <span className="text-sm text-stone-700 font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-[11px] text-stone-500 leading-relaxed">
            By continuing, you agree to our{' '}
            <Link to="/terms"   className="font-semibold text-stone-700 underline underline-offset-2">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="font-semibold text-stone-700 underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════
          DESKTOP layout  (hidden below lg)
      ════════════════════════════════════════*/}
      <div className="hidden lg:flex min-h-screen bg-[#faf8f5]">

        {/* Left brand panel */}
        <div className="w-[46%] xl:w-[48%] shrink-0 bg-stone-900 flex flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-900/40 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-rose-800/25 blur-[90px] pointer-events-none" />

          <Link to="/">
            <img src="/logo.png" alt="Enbroidery" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>

          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-heading font-bold text-white leading-[1.15] mb-4">
                Handcrafted<br />
                <span className="text-rose-400">with love</span>,<br />
                for you.
              </h2>
              <p className="text-stone-400 text-base leading-relaxed max-w-xs">
                Premium embroidery &amp; home décor, lovingly crafted and delivered to your door.
              </p>
            </div>

            <div className="space-y-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-rose-300" />
                  </div>
                  <span className="text-sm font-medium text-stone-300">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-stone-600 text-xs italic">"Every thread tells a story."</p>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-stone-900 mb-2">
                Welcome back 👋
              </h1>
              <p className="text-stone-600 text-sm leading-relaxed">
                Sign in to track orders, save favourites and get exclusive deals.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest text-center">
                Sign in with
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full rounded-2xl py-3.5 px-5 flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-60 active:scale-[0.98] shadow-lg shadow-blue-500/20 font-bold text-white text-sm" style={{background: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)'}} onMouseOver={e=>e.currentTarget.style.opacity='0.92'} onMouseOut={e=>e.currentTarget.style.opacity='1'}
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="" />
                )}
                <span className="font-bold text-white text-sm">
                  {loading ? 'Signing in…' : 'Continue with Google'}
                </span>
              </button>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-stone-100" />
                <div className="flex items-center gap-1.5 text-stone-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Secured by Google OAuth</span>
                </div>
                <div className="flex-1 h-px bg-stone-100" />
              </div>
            </div>

            <p className="mt-6 text-center text-[11px] text-stone-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <Link to="/terms"   className="font-semibold text-stone-700 underline underline-offset-2 hover:text-rose-900">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="font-semibold text-stone-700 underline underline-offset-2 hover:text-rose-900">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
