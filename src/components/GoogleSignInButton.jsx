import React, { useEffect, useRef, useState } from 'react';
import API_URL from '../config/api';

const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim() ||
  '542538347400-cdkgqs944mo35k627h6j7u7531hfre22.apps.googleusercontent.com';

/**
 * Official Google Identity Services (GIS) Sign-In Button Component
 * - Automatically loads GIS SDK if needed
 * - Renders official Google Sign-In button adhering to Google Security & Branding Guidelines
 * - Sends ID token to backend for cryptographic verification
 * - Manages loading, errors, returning users, and new student registration
 */
export default function GoogleSignInButton({
  mode = 'signin', // 'signin' | 'signup'
  onSuccess,
  onError,
  onLoadingChange,
  width = 320,
  shape = 'rectangular', // 'rectangular' | 'pill'
  theme = 'outline',
  text, // 'signin_with' | 'signup_with' | 'continue_with'
  className = ''
}) {
  const containerRef = useRef(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Notify parent component of loading state changes
  const updateLoading = (val) => {
    setLoading(val);
    if (onLoadingChange) onLoadingChange(val);
  };

  // 1. Ensure Google Identity Services script is present and initialized
  useEffect(() => {
    let isMounted = true;
    let timer = null;

    const initGsi = () => {
      if (!window.google?.accounts?.id) return false;

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true
        });

        if (isMounted) {
          setSdkLoaded(true);
          setLoadError(null);
        }
        return true;
      } catch (err) {
        console.warn('[GSI] Initialization error:', err);
        if (isMounted) setLoadError('Google Sign-In initialization failed.');
        return false;
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      // Check if script is already in document
      let script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener('load', () => {
        if (isMounted) initGsi();
      });

      script.addEventListener('error', () => {
        if (isMounted) {
          setLoadError('Google Identity Services could not be loaded. Please check ad blockers or network.');
        }
      });

      // Polling fallback in case load event fired before listener attached
      let attempts = 0;
      timer = setInterval(() => {
        attempts++;
        if (initGsi() || attempts > 20) {
          clearInterval(timer);
        }
      }, 250);
    }

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  // 2. Render Google official button once SDK and container are ready
  useEffect(() => {
    if (!sdkLoaded || !containerRef.current || !window.google?.accounts?.id) return;

    try {
      containerRef.current.innerHTML = '';
      const buttonText = text || (mode === 'signup' ? 'signup_with' : 'signin_with');

      // Calculate width constrained between 200px and 400px (Google GIS constraints)
      let resolvedWidth = 320;
      if (typeof width === 'number') {
        resolvedWidth = Math.min(Math.max(width, 200), 400);
      } else if (containerRef.current.offsetWidth) {
        resolvedWidth = Math.min(Math.max(containerRef.current.offsetWidth, 200), 400);
      }

      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: theme,
        size: 'large',
        text: buttonText,
        shape: shape,
        logo_alignment: 'left',
        width: resolvedWidth
      });
    } catch (renderErr) {
      console.warn('[GSI] Button render error:', renderErr);
    }
  }, [sdkLoaded, mode, width, shape, theme, text]);

  // 3. Handle credential token response from Google
  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      const msg = 'No credential token received from Google.';
      if (onError) onError(msg);
      return;
    }

    updateLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // Persist session tokens to local and session storage
        try {
          if (data.token) {
            localStorage.setItem('professorvirus_token', data.token);
            sessionStorage.setItem('professorvirus_token', data.token);
          }
          if (data.user) {
            localStorage.setItem('professorvirus_user', JSON.stringify(data.user));
            sessionStorage.setItem('professorvirus_user', JSON.stringify(data.user));
            localStorage.setItem('campusprep_auth_user', JSON.stringify(data.user));
          }
          window.dispatchEvent(new Event('auth_state_changed'));
        } catch (storageErr) {
          console.warn('[STORAGE] Failed to write user token to storage:', storageErr);
        }

        if (onSuccess) onSuccess(data);
      } else {
        const errorText = data.message || 'Google account verification failed.';
        if (onError) onError(errorText);
      }
    } catch (networkErr) {
      console.error('[AUTH] Google auth network error:', networkErr);
      const networkMsg = 'Unable to connect to ProfessorVirus authentication server. Please check your internet connection.';
      if (onError) onError(networkMsg);
    } finally {
      updateLoading(false);
    }
  };

  return (
    <div className={`google-auth-wrapper w-full flex flex-col items-center justify-center ${className}`}>
      {loading ? (
        <div
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[#C88D2D]/40 bg-[transparent] text-[#1F2421] text-xs sm:text-sm font-semibold shadow-xs"
          style={{ minHeight: '44px' }}
        >
          <div className="w-4 h-4 border-2 border-[#781416]/30 border-t-[#781416] rounded-full animate-spin" />
          <span>Verifying Google account...</span>
        </div>
      ) : loadError ? (
        <div className="w-full text-center py-2 px-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          <p className="font-semibold">{loadError}</p>
          <p className="mt-1 text-[11px] text-stone-500">
            Please disable ad blockers or sign in with your email & password.
          </p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="google-button-container flex items-center justify-center w-full"
          style={{ minHeight: '44px' }}
        />
      )}
    </div>
  );
}
