import React, { useState, useEffect } from 'react';
import { Shield, Cookie, Sliders, X, Check, ArrowRight } from 'lucide-react';
import CookieSettingsModal from './CookieSettingsModal';

const STORAGE_KEY = 'pv_cookie_consent';

export default function CookieConsent() {
  const [consent, setConsent] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // If no preference stored, reveal banner after a small delay for smooth experience
    if (!consent) {
      const timer = setTimeout(() => setIsBannerVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [consent]);

  // Global listener so users can reopen cookie settings anytime from Footer or More page
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsSettingsOpen(true);
    };

    window.openCookieSettings = handleOpenSettings;
    window.addEventListener('open_cookie_settings', handleOpenSettings);
    return () => {
      delete window.openCookieSettings;
      window.removeEventListener('open_cookie_settings', handleOpenSettings);
    };
  }, []);

  const saveConsent = (preferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setConsent(preferences);
      setIsBannerVisible(false);
      setIsSettingsOpen(false);
      // Dispatch custom event if any scripts need to react
      window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: preferences }));
    } catch (e) {
      console.warn('Could not save cookie consent:', e);
    }
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      functional: true,
      timestamp: new Date().toISOString()
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      functional: false,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <>
      {isBannerVisible && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="pv-cookie-banner"
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            left: '1rem',
            maxWidth: '540px',
            marginLeft: 'auto',
            zIndex: 9990,
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #F0E6E8',
            boxShadow: '0 16px 40px rgba(90, 15, 25, 0.18), 0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: '1.15rem 1.25rem',
            animation: 'pvSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* HEADER ROW */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#FDF2F4',
                border: '1px solid #F6D6DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7A1C28',
                flexShrink: 0
              }}>
                <Shield size={18} />
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 800,
                color: '#1A1A1A',
                letterSpacing: '-0.01em'
              }}>
                Your Privacy Matters
              </h3>
            </div>

            <button
              type="button"
              onClick={handleRejectNonEssential}
              aria-label="Close and reject non-essential cookies"
              style={{
                background: 'none',
                border: 'none',
                color: '#888888',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* BODY TEXT */}
          <p style={{
            margin: '0 0 1rem',
            fontSize: '0.82rem',
            color: '#555555',
            lineHeight: 1.45,
            fontWeight: 450
          }}>
            ProfessorVirus uses cookies to improve your experience, understand website usage, and keep the platform secure.
          </p>

          {/* ACTION BUTTONS */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.5rem'
          }}>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #E5DCDD',
                backgroundColor: '#FAF7F8',
                color: '#4A3B3D',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0E6E8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FAF7F8'}
            >
              <Sliders size={13} />
              Cookie Settings
            </button>

            <button
              type="button"
              onClick={handleRejectNonEssential}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #D8CCCE',
                backgroundColor: '#FFFFFF',
                color: '#63121F',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FDF2F4'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Reject Non-Essential
            </button>

            <button
              type="button"
              onClick={handleAcceptAll}
              style={{
                padding: '0.5rem 1.05rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#7A1C28',
                backgroundImage: 'linear-gradient(135deg, #85182A 0%, #63121F 100%)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(122, 28, 40, 0.3)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Accept All
            </button>
          </div>
        </aside>
      )}

      {/* SETTINGS MODAL */}
      <CookieSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={saveConsent}
        initialConsent={consent}
      />
    </>
  );
}
