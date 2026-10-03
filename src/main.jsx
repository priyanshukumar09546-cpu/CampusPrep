import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

import { API_URL } from './config/api';

// Automatically handle production backend API URL if configured via VITE_API_URL or VITE_BACKEND_URL or API_URL
const customApiUrl = (API_URL || import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '').trim();
if (customApiUrl && typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  const cleanBase = customApiUrl.replace(/\/+$/, '');
  window.fetch = function (resource, init) {
    if (typeof resource === 'string' && resource.startsWith('/api/')) {
      return originalFetch.call(this, `${cleanBase}${resource}`, init);
    }
    return originalFetch.call(this, resource, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
