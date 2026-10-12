import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { setupGlobalErrorHandlers } from './utils/crashLogger'

// 🔍 Setup global crash monitoring (catches errors that ErrorBoundary misses)
setupGlobalErrorHandlers()

// 🛡️ Defensive patch for DOM manipulation by translation extensions (Google Translate, Chrome/Safari Auto-Translate)
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console) {
        console.warn('[DOM Guard] Cannot remove child: parent node mismatch or already detached', this, child);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.warn('[DOM Guard] Cannot insert before: reference node parent mismatch', this, referenceNode);
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

// 📱 Capture PWA install prompt early, before React mounts
// This ensures the event is never missed even if it fires before components mount
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log('[PWA] beforeinstallprompt captured early');
});

// Register Service Worker and gracefully handle errors to prevent Unhandled Promise Rejection crashes
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    onRegisterError(error) {
      console.warn('[PWA] Service worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)
