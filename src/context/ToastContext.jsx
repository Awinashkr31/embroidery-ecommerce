import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', action = null) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, action }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 left-4 right-4 md:top-auto md:bottom-4 md:left-auto md:right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto w-full md:w-auto flex justify-center md:justify-end">
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
            action={toast.action}
          />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
