import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

import { API_URL } from './config/api';

// If API_URL is non-empty (e.g. local dev http://localhost:5000 or custom VITE_API_URL),
// automatically prefix relative /api/ fetch calls.
// If API_URL is empty (production same-origin), calls remain relative /api/ to the current host.
if (API_URL && typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  const cleanBase = API_URL.replace(/\/+$/, '');
  window.fetch = function (resource, init) {
    if (typeof resource === 'string' && resource.startsWith('/api/')) {
      return originalFetch.call(this, `${cleanBase}${resource}`, init);
    }
    return originalFetch.call(this, resource, init);
  };
}

// Handle Vite dynamic import chunk preload failures after production redeployments
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('[ProfessorVirus] Vite preload error: fresh deployment chunk detected. Auto-reloading...', event);
    const reloadKey = 'pv_preload_reload';
    const lastReload = window.sessionStorage.getItem(reloadKey);
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      window.sessionStorage.setItem(reloadKey, String(now));
      window.location.reload();
    }
  });
}

import { ThemeProvider } from './context/ThemeContext.jsx';
import { CourseProvider } from './context/CourseContext.jsx';
import { registerServiceWorker } from './utils/pwaManager.js';

// Initialize PWA Service Worker for offline support and native install prompt eligibility
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <CourseProvider>
          <App />
        </CourseProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
