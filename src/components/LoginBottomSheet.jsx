import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginBottomSheet = () => {
  const { signInWithGoogle, isLoginSheetOpen, closeLoginSheet } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!isLoginSheetOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      addToast("Successfully signed in!", "success");
      closeLoginSheet();
      navigate('/profile');
    } catch (error) {
      console.error("Login failed", error);
      addToast("Failed to sign in. Please try again.", "error");
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity" 
        onClick={closeLoginSheet} 
      />
      <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl transform transition-transform animate-in slide-in-from-bottom duration-300">
        <button 
          onClick={closeLoginSheet} 
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 bg-stone-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-8 mt-4">
          <h2 className="text-2xl font-heading font-bold text-stone-900 uppercase tracking-widest mb-2">Welcome Back</h2>
          <p className="text-stone-500 text-sm">Sign in to access your profile and saved items.</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-black transition-colors shadow-md"
          >
            <div className="bg-white p-1 rounded-full flex items-center justify-center">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
            </div>
            Continue with Google
          </button>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </>
  );
};

export default LoginBottomSheet;
