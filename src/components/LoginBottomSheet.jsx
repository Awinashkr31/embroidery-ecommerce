import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginBottomSheet = () => {
  const { signInWithGoogle, isLoginSheetOpen, closeLoginSheet } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = window.location;
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginSheetOpen) return null;

  const handleClose = () => {
      // Reset state for next time
      setTimeout(() => {
          setIsSuccess(false);
          setIsLoading(false);
      }, 300); // Wait for transition
      closeLoginSheet();
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      setIsSuccess(true);
      
      // Wait for animation to finish before closing and navigating
      setTimeout(() => {
          handleClose();
          if (location.pathname !== '/cart' && location.pathname !== '/checkout') {
              navigate('/profile');
          }
      }, 2000);
      
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false);
      addToast("Failed to sign in. Please try again.", "error");
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity" 
        onClick={handleClose} 
      />
      <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl transform transition-transform animate-in slide-in-from-bottom duration-300">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 bg-stone-100 rounded-full transition-colors"
          disabled={isLoading || isSuccess}
        >
          <X className="w-5 h-5" />
        </button>
        
        {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm animate-circle-grow relative">
                    {/* Inner pulse */}
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
                    <Check className="w-10 h-10 text-emerald-500 animate-draw-check relative z-10" strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold text-stone-900 tracking-wide mb-2 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-150">Login Successful</h2>
                <p className="text-stone-500 font-medium animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300">Welcome back!</p>
            </div>
        ) : (
            <div className="animate-in fade-in duration-300">
                <div className="text-center mb-8 mt-4">
                  <h2 className="text-2xl font-heading font-bold text-stone-900 uppercase tracking-widest mb-2">Welcome Back</h2>
                  <p className="text-stone-500 text-sm">Sign in to access your profile and saved items.</p>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-black transition-colors shadow-md disabled:opacity-80"
                  >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-1 rounded-full flex items-center justify-center">
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                            </div>
                            Continue with Google
                        </>
                    )}
                  </button>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">By continuing, you agree to our Terms of Service</p>
                </div>
            </div>
        )}
      </div>
    </>
  );
};

export default LoginBottomSheet;
