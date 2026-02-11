import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { X, AlertTriangle } from 'lucide-react';

const LoginSignup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signInWithGoogle, currentUser } = useAuth();
    
    // Steps: 'login', 'profile' (if needed later)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
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
             // Supabase handles redirect automatically
        } catch (err) {
            console.error(err);
             setError("Failed to sign in with Google: " + (err.message || "Unknown error"));
             setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white md:bg-[#fdfbf7] flex flex-col items-center justify-center p-0 md:p-4">
            <SEO title="Login / Signup" description="Sign in or create an account to shop at Enbroidery By Sana." />
            
            {/* Close Button (Mobile Only) */}
            <button 
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 p-2 text-stone-500 hover:text-stone-900 md:hidden z-10"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Logo (Hidden on mobile if desired, or kept) */}
            <Link to="/" className="hidden md:block mb-8 hover:opacity-80 transition-opacity">
                <img src="/logo.png" alt="Enbroidery" className="h-16 md:h-20 w-auto object-contain" />
            </Link>

            <div className="w-full max-w-md bg-white md:rounded-3xl md:shadow-xl md:shadow-stone-200/50 overflow-hidden md:border border-stone-100 relative min-h-screen md:min-h-0 flex flex-col justify-center">
                
                {/* Progress / Loading Bar */}
                {loading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 overflow-hidden z-20">
                        <div className="h-full bg-rose-900 animate-loading-bar"></div>
                    </div>
                )}

                <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                    
                    {/* Header (Mobile Visible) */}
                    <div className="md:hidden flex justify-center mb-8">
                         <img src="/logo.png" alt="Enbroidery" className="h-12 w-auto object-contain" />
                    </div>

                    {/* Error Messages */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in slide-in-from-top-2">
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-2xl font-heading font-bold text-stone-900 mb-2">Welcome 👋</h1>
                            <p className="text-stone-500 font-medium">Sign in to continue</p>
                        </div>

                        <button 
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-4 border border-stone-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors font-bold text-stone-700 relative overflow-hidden group bg-white shadow-sm"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                            <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
                        </button>
                        
                        <p className="mt-8 text-center text-xs text-stone-400">
                            By continuing, you agree to our <Link to="/terms" className="underline hover:text-stone-600">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-stone-600">Privacy Policy</Link>.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
