import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { setupGlobalErrorHandlers } from './utils/crashLogger'

// 🔍 Setup global crash monitoring (catches errors that ErrorBoundary misses)
setupGlobalErrorHandlers()

// 📱 Capture PWA install prompt early, before React mounts
// This ensures the event is never missed even if it fires before components mount
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log('[PWA] beforeinstallprompt captured early');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)
