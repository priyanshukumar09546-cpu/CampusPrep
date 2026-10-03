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

import { CourseProvider } from './context/CourseContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CourseProvider>
        <App />
      </CourseProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
