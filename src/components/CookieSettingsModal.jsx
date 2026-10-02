import React, { useState, useEffect } from 'react';
import { X, Shield, Check, Lock, Sliders, ExternalLink } from 'lucide-react';

export default function CookieSettingsModal({ isOpen, onClose, onSave, initialConsent }) {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    functional: true
  });

  useEffect(() => {
    if (initialConsent) {
      setPreferences({
        necessary: true,
        analytics: Boolean(initialConsent.analytics),
        functional: initialConsent.functional !== undefined ? Boolean(initialConsent.functional) : true
      });
    }
  }, [initialConsent, isOpen]);

  // Keyboard navigation: ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      necessary: true,
      analytics: preferences.analytics,
      functional: preferences.functional,
      timestamp: new Date().toISOString()
    });
  };

  const handleAcceptAll = () => {
    onSave({
      necessary: true,
      analytics: true,
      functional: true,
      timestamp: new Date().toISOString()
    });
  };

  const handleRejectNonEssential = () => {
    onSave({
      necessary: true,
      analytics: false,
      functional: false,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-settings-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 8, 10, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'pvFadeIn 0.25s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(90, 15, 25, 0.25)',
          border: '1px solid #F0E6E8',
          overflow: 'hidden'
        }}
      >
        {/* MODAL HEADER */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #F2EAEC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FAF7F8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FDF2F4',
              border: '1px solid #F6D6DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7A1C28'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 id="cookie-settings-title" style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#1A1A1A',
                letterSpacing: '-0.02em'
              }}>
                Cookie Preferences
              </h2>
              <p style={{
                margin: '0.15rem 0 0',
                fontSize: '0.78rem',
                color: '#666666'
              }}>
                Control which cookies ProfessorVirus can store on your device
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cookie settings"
            style={{
              background: 'none',
              border: 'none',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666666',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0E6E8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Necessary Cookies */}
          <div style={{
            padding: '1rem 1.15rem',
            borderRadius: '16px',
            backgroundColor: '#FAF9F6',
            border: '1px solid #EDE8DE',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1A1A1A' }}>
                  Necessary Cookies
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#7A1C28',
                  backgroundColor: '#FDF2F4',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Lock size={10} /> Always Active
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#555555', lineHeight: 1.45 }}>
                Required for core website operations, session safety, secure user authentication, and basic academic resource delivery. Cannot be disabled.
              </p>
            </div>
            <div style={{
              width: '42px',
              height: '24px',
              backgroundColor: '#7A1C28',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '2px 4px',
              opacity: 0.85
            }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
            </div>
          </div>

          {/* Analytics Cookies */}
          <div style={{
            padding: '1rem 1.15rem',
            borderRadius: '16px',
            backgroundColor: preferences.analytics ? '#FDF8F9' : '#FFFFFF',
            border: preferences.analytics ? '1.5px solid #F3D6DA' : '1px solid #EBE5D8',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1A1A1A' }}>
                  Analytics Cookies
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#475569',
                  backgroundColor: '#F1F5F9',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px'
                }}>
                  Optional
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#555555', lineHeight: 1.45 }}>
                Collect aggregated, anonymous statistics about which study guides, PYQs, and interview questions students use most, helping us improve learning materials.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preferences.analytics}
              aria-label="Toggle analytics cookies"
              onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
              style={{
                width: '44px',
                height: '24px',
                backgroundColor: preferences.analytics ? '#7A1C28' : '#CBD5E1',
                borderRadius: '999px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: preferences.analytics ? 'flex-end' : 'flex-start',
                padding: '2px 3px',
                cursor: 'pointer',
                transition: 'background-color 0.25s ease'
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>

          {/* Functional Cookies */}
          <div style={{
            padding: '1rem 1.15rem',
            borderRadius: '16px',
            backgroundColor: preferences.functional ? '#FDF8F9' : '#FFFFFF',
            border: preferences.functional ? '1.5px solid #F3D6DA' : '1px solid #EBE5D8',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1A1A1A' }}>
                  Functional Cookies
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#475569',
                  backgroundColor: '#F1F5F9',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px'
                }}>
                  Optional
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#555555', lineHeight: 1.45 }}>
                Preserves your active semester filters, preferred course selection, recent search topics, and dark/light UI theme choices across page reloads.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preferences.functional}
              aria-label="Toggle functional cookies"
              onClick={() => setPreferences(p => ({ ...p, functional: !p.functional }))}
              style={{
                width: '44px',
                height: '24px',
                backgroundColor: preferences.functional ? '#7A1C28' : '#CBD5E1',
                borderRadius: '999px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: preferences.functional ? 'flex-end' : 'flex-start',
                padding: '2px 3px',
                cursor: 'pointer',
                transition: 'background-color 0.25s ease'
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div style={{
          padding: '1.15rem 1.5rem',
          borderTop: '1px solid #F2EAEC',
          backgroundColor: '#FAF7F8',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem'
        }}>
          <button
            type="button"
            onClick={handleRejectNonEssential}
            style={{
              padding: '0.55rem 0.95rem',
              borderRadius: '12px',
              border: '1.5px solid #D1C7C9',
              backgroundColor: '#FFFFFF',
              color: '#4A3B3D',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5EDEF'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Reject Non-Essential
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '12px',
                border: '1.5px solid #7A1C28',
                backgroundColor: '#FFFFFF',
                color: '#7A1C28',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FDF2F4'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Save Preferences
            </button>

            <button
              type="button"
              onClick={handleAcceptAll}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#7A1C28',
                backgroundImage: 'linear-gradient(135deg, #85182A 0%, #63121F 100%)',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(122, 28, 40, 0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
