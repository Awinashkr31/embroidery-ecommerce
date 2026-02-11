import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { Mail, ArrowRight, X, CheckCircle, AlertTriangle } from 'lucide-react';

const LoginSignup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginWithOtp, verifyOtp, signInWithGoogle, currentUser, updateUser } = useAuth();
    
    // Steps: 'email', 'otp', 'profile'
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(30);

    const otpRefs = useRef([]);

    // Redirect if already logged in (unless we're in 'profile' step to complete registration)
    useEffect(() => {
        if (currentUser && step !== 'profile') {
           // If user has no display name, force profile step
           if (!currentUser.displayName) {
               setStep('profile');
           } else {
               const from = location.state?.from?.pathname || '/';
               navigate(from, { replace: true });
           }
        }
    }, [currentUser, navigate, step, location]);

    // Timer for Resend OTP
    useEffect(() => {
        let interval;
        if (step === 'otp' && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, resendTimer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { error: otpError } = await loginWithOtp(email);
            if (otpError) throw otpError;
            
            setStep('otp');
            setMessage('We sent a 6-digit code to your email.');
            setResendTimer(30);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;

        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.value && index < 5) {
            otpRefs.current[index + 1].focus();
        }

        // Auto submit if all filled
        if (newOtp.join("").length === 6) {
           handleOtpVerify(newOtp.join(""));
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                 otpRefs.current[index - 1].focus();
            }
        }
    };

    const handleOtpVerify = async (otpValue = otp.join("")) => {
        setError('');
        setMessage('');
        setLoading(true); // Don't block UI with full loading if possible, but here we submit

        try {
            const { data, error: otpError } = await verifyOtp(email, otpValue);
            if (otpError) throw otpError;
            
            // Check if user needs to set profile
            // Note: CurrentUser might not update fast enough in this cycle, so we rely on useEffect or data
            if (!data.user.user_metadata?.full_name) {
                setStep('profile');
            } else {
                // Redirect handled by useEffect
            }

        } catch (err) {
            console.error(err);
            setError('Incorrect code. Please check and try again.');
            setOtp(new Array(6).fill("")); // Clear OTP on error
            if (otpRefs.current[0]) otpRefs.current[0].focus();
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await updateUser(fullName, null);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
             // Supabase handles redirect automatically
        } catch (err) {
            console.error(err);
             setError("Failed to sign in with Google: " + (err.message || "Unknown error"));
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setResendTimer(30);
        try {
             await loginWithOtp(email);
             setMessage('New code sent successfully!');
        } catch (error) {
             console.error(error);
            setError('Failed to resend code.');
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4 pt-20">
            <SEO title="Login / Signup" description="Sign in or create an account to shop at Enbroidery By Sana." />
            
            {/* Logo */}
            <Link to="/" className="mb-8 hover:opacity-80 transition-opacity">
                <img src="/logo.png" alt="Enbroidery" className="h-16 md:h-20 w-auto object-contain" />
            </Link>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-100 relative">
                
                {/* Progress / Loading Bar */}
                {loading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 overflow-hidden">
                        <div className="h-full bg-rose-900 animate-loading-bar"></div>
                    </div>
                )}

                <div className="p-8 md:p-10">
                    
                    {/* Error / Success Messages */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in slide-in-from-top-2">
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}
                    
                    {message && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 animate-in slide-in-from-top-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-emerald-800">{message}</p>
                        </div>
                    )}

                    {/* Step 1: Email Entry */}
                    {step === 'email' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-heading font-bold text-stone-900 mb-2">Welcome 👋</h1>
                                <p className="text-stone-500 font-medium">Sign in or create an account</p>
                            </div>

                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-4 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all text-lg font-medium text-stone-900 placeholder:text-stone-300"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Sending...' : 'Continue'}
                                    {!loading && <ArrowRight className="w-5 h-5" />}
                                </button>
                            </form>

                            <div className="my-8 flex items-center gap-4">
                                <div className="h-px bg-stone-200 flex-1"></div>
                                <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">OR</span>
                                <div className="h-px bg-stone-200 flex-1"></div>
                            </div>

                            <button 
                                onClick={handleGoogleLogin}
                                className="w-full py-3.5 border border-stone-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors font-bold text-stone-700 relative overflow-hidden group"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                                <span>Continue with Google</span>
                            </button>
                            
                            <p className="mt-8 text-center text-xs text-stone-400">
                                By continuing, you agree to our <Link to="/terms" className="underline hover:text-stone-600">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-stone-600">Privacy Policy</Link>.
                            </p>
                        </div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 'otp' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="text-center mb-8">
                                <h1 className="text-2xl font-heading font-bold text-stone-900 mb-2">Check your email 📩</h1>
                                <p className="text-stone-500 font-medium">We sent a 6-digit code to <br/><span className="font-bold text-stone-900">{email}</span></p>
                            </div>

                            <div className="flex gap-2 justify-center mb-8">
                                {otp.map((data, index) => (
                                    <input 
                                        key={index}
                                        type="text"
                                        name="otp"
                                        maxLength="1"
                                        ref={el => otpRefs.current[index] = el}
                                        value={data}
                                        onChange={e => handleOtpChange(e.target, index)}
                                        onKeyDown={e => handleKeyDown(e, index)}
                                        className="w-10 h-12 md:w-12 md:h-14 border border-stone-200 rounded-xl text-center text-xl md:text-2xl font-bold bg-stone-50 focus:bg-white focus:border-rose-900 outline-none transition-all selection:bg-rose-100"
                                    />
                                ))}
                            </div>

                             <button 
                                onClick={() => handleOtpVerify()}
                                disabled={otp.join("").length !== 6 || loading}
                                className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            <div className="flex flex-col items-center gap-4 text-sm font-medium">
                                <button 
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0}
                                    className={`${resendTimer > 0 ? 'text-stone-400 cursor-default' : 'text-rose-900 hover:text-rose-700 hover:underline'}`}
                                >
                                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                                </button>
                                
                                <button 
                                    onClick={() => setStep('email')}
                                    className="text-stone-500 hover:text-stone-800"
                                >
                                    Change email address
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Profile Completion */}
                    {step === 'profile' && (
                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="text-center mb-8">
                                <h1 className="text-2xl font-heading font-bold text-stone-900 mb-2">Almost done 🎉</h1>
                                <p className="text-stone-500 font-medium">Just need a name to call you by.</p>
                            </div>

                             <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 pl-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g. Sana Khan"
                                        className="w-full px-4 py-4 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all text-lg font-medium text-stone-900 placeholder:text-stone-300"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading || !fullName.trim()}
                                    className="w-full bg-rose-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-800 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                     {loading ? 'Creating Account...' : 'Finish & Continue'}
                                    {!loading && <ArrowRight className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
