import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, ArrowRight } from 'lucide-react';

const Toast = ({ message, type, onClose, action }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure animation triggers
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for transition out
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-rose-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-stone-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success': return 'border-l-4 border-l-rose-500 bg-white';
      case 'error': return 'border-l-4 border-l-red-500 bg-white';
      default: return 'border-l-4 border-l-stone-400 bg-white';
    }
  };

  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-lg shadow-xl border border-stone-100 
        w-auto max-w-[90vw] md:min-w-[320px] md:max-w-md
        transform transition-all duration-500 ease-out font-body bg-white backdrop-blur-sm bg-white/95
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'}
        ${getStyles()}
      `}
      role="alert"
    >
      <div className="mt-0.5 flex-shrink-0 animate-in zoom-in duration-300">
        {getIcon()}
      </div>
      
      <div className="flex-1 mr-2">
        <p className="text-stone-800 text-sm font-medium leading-relaxed">{message}</p>
        
        {action && (
          <button
            onClick={() => {
              action.onClick();
              handleClose();
            }}
            className="mt-3 text-xs font-bold uppercase tracking-wide text-rose-700 hover:text-rose-900 flex items-center gap-1 group transition-colors"
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
