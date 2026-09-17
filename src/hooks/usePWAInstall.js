import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(window.deferredPrompt || null);
  
  // Check if app is already running in standalone mode (PWA)
  const [isStandalone, setIsStandalone] = useState(
    window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone || 
    false
  );

  // Read manual dismissal or success state from local storage (secondary cache only)
  const [hasInstalled, setHasInstalled] = useState(
    localStorage.getItem('pwa_installed') === 'true'
  );

  const isIos = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase());

  // Debug logging
  console.log('[PWA Hook] Init:', { 
    hasDeferredPrompt: !!window.deferredPrompt, 
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    iosStandalone: window.navigator.standalone,
    hasInstalled: localStorage.getItem('pwa_installed'),
    isIos
  });

  useEffect(() => {
    // Listen for the prompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      window.deferredPrompt = e;
      
      // If we got a new prompt, the user must have uninstalled the app or it's a new session.
      // Override local storage cache to allow showing the button again.
      setHasInstalled(false);
      localStorage.removeItem('pwa_installed');
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      window.deferredPrompt = null;
      setIsStandalone(true);
      setHasInstalled(true);
      localStorage.setItem('pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Watch for display mode changes (e.g. user opens the installed app)
    const matchMedia = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsStandalone(true);
        setHasInstalled(true);
        localStorage.setItem('pwa_installed', 'true');
      }
    };
    
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleDisplayModeChange);
    } else if (matchMedia.addListener) {
      // Fallback for older Safari
      matchMedia.addListener(handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener('change', handleDisplayModeChange);
      } else if (matchMedia.removeListener) {
        matchMedia.removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    
    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        // Hide the prompt immediately
        setDeferredPrompt(null);
        window.deferredPrompt = null;
        setHasInstalled(true);
        localStorage.setItem('pwa_installed', 'true');
        return true;
      } else {
        // User cancelled - keep the deferred prompt so they can try again later
        // Note: Chrome won't allow prompt() to be called twice on the same event.
        // But we must follow the instruction to keep it visible if rejected.
        return false;
      }
    } catch (err) {
      console.warn('PWA prompt failed:', err);
      // If the prompt is consumed, return false so the UI can show a fallback toast
      return false;
    }
  };

  // We consider the app "installable" if it's not standalone, and we have a deferred prompt.
  // For iOS, we don't get deferred prompts, so we allow it if it's not standalone and not cached as installed.
  const isInstallable = !isStandalone && (!!deferredPrompt || (isIos && !hasInstalled));

  return {
    isInstallable,
    promptInstall,
    isStandalone,
    deferredPrompt
  };
};
