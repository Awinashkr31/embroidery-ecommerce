import { useState, useEffect } from 'react';

/**
 * 📡 NetworkStatus — Shows a non-intrusive banner when the user goes offline.
 * Auto-hides with smooth animation when back online.
 */
const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show "back online" message briefly
      if (wasOffline) {
        setTimeout(() => setShowBanner(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-in-out ${
        showBanner ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className={`px-4 py-2.5 text-center text-sm font-bold flex items-center justify-center gap-2 ${
        isOnline
          ? 'bg-emerald-500 text-white'
          : 'bg-red-600 text-white'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            Back online! Connection restored.
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 animate-pulse" />
            No internet connection. Some features may not work.
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;
