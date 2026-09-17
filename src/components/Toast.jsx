import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Toast = ({ message, type, onClose, action }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const isCartToast = message?.toLowerCase().includes('bag') || message?.toLowerCase().includes('cart');

  if (isCartToast && type === 'success') {
    return (
      <div 
        className={`
          flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl 
          w-full max-w-[92vw] md:w-auto md:min-w-[340px] md:max-w-md
          transform transition-all duration-400 ease-out
          bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white
          border border-white/10
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 md:translate-y-4 opacity-0 scale-95'}
        `}
        role="alert"
      >
        <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
          <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-white text-[13px] font-bold leading-tight">{message}</p>
          <p className="text-white/50 text-[11px] mt-0.5">Tap to view your bag</p>
        </div>

        <button
          onClick={() => { handleClose(); navigate('/cart'); }}
          className="px-3.5 py-1.5 bg-white text-[#1a1a2e] text-[11px] font-bold rounded-full hover:bg-stone-100 transition-colors whitespace-nowrap shadow-sm"
        >
          View Bag
        </button>

        <button 
          onClick={handleClose}
          className="text-white/40 hover:text-white/80 transition-colors p-0.5 ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-stone-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-white border border-emerald-100';
      case 'error': return 'bg-white border border-red-100';
      default: return 'bg-white border border-stone-200';
    }
  };

  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl
        w-full max-w-[92vw] md:w-auto md:min-w-[320px] md:max-w-md
        transform transition-all duration-400 ease-out backdrop-blur-sm
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 md:translate-y-4 opacity-0 scale-95'}
        ${getStyles()}
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 mr-1">
        <p className="text-stone-800 text-[13px] font-semibold leading-tight">{message}</p>
        
        {action && (
          <button
            onClick={() => {
              action.onClick();
              handleClose();
            }}
            className="mt-2 text-[11px] font-bold uppercase tracking-wide text-rose-700 hover:text-rose-900 flex items-center gap-1 group transition-colors"
          >
            {action.label}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <button 
        onClick={handleClose}
        className="text-stone-400 hover:text-stone-600 transition-colors p-1 hover:bg-stone-100 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
