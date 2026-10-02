import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

const WHATSAPP_URL = 'https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G';
const TELEGRAM_URL = 'https://t.me/+l216KZ64jedmOWZl';

export default function StayConnectedPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Only show once per session
    try {
      const alreadyShown = sessionStorage.getItem('pv_stay_connected_shown');
      if (alreadyShown) return;
    } catch (e) {}

    // Delay popup by 2.5 seconds for a smooth UX after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
      try {
        sessionStorage.setItem('pv_stay_connected_shown', '1');
      } catch (e) {}
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 16, 12, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: isClosing ? 'scPopupFadeOut 0.3s ease forwards' : 'scPopupFadeIn 0.4s ease forwards'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#FCFAF6',
          borderRadius: '24px',
          border: '2px solid #E8E0D0',
          width: '100%',
          maxWidth: '440px',
          padding: '2.25rem 2rem 2rem 2rem',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(200, 141, 45, 0.15)',
          animation: isClosing ? 'scCardSlideOut 0.3s ease forwards' : 'scCardSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#EDE5D6',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#554C42',
            transition: 'all 0.2s ease',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#DDD4C4';
            e.currentTarget.style.color = '#1C1814';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#EDE5D6';
            e.currentTarget.style.color = '#554C42';
          }}
        >
          <X size={18} />
        </button>

        {/* Logo & Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '2px solid #C88D2D',
            backgroundColor: '#FFFFFF',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(200, 141, 45, 0.2)'
          }}>
            <img
              src="/assets/navbar_logo.png"
              alt="ProfessorVirus"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/navbar_logo.jpg';
              }}
            />
          </div>
          <div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#C88D2D',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              ProfessorVirus
            </div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.68rem',
              fontWeight: 600,
              color: '#70675D'
            }}>
              Your Academic Companion
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.55rem',
          fontWeight: 900,
          color: '#1C1814',
          lineHeight: 1.2,
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.02em'
        }}>
          Stay Connected with{' '}
          <span style={{ color: '#C88D2D' }}>ProfessorVirus</span>
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '0.88rem',
          fontWeight: 500,
          color: '#665C50',
          lineHeight: 1.55,
          margin: '0 0 1.5rem 0'
        }}>
          Get the latest notes, PYQs, jobs, internships, AKTU updates and important announcements directly on WhatsApp and Telegram.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {/* WhatsApp Button */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '0.88rem 1.25rem',
              borderRadius: '14px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              fontSize: '0.96rem',
              fontWeight: 800,
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1EBE5A';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#25D366';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.3)';
            }}
          >
            {/* WhatsApp SVG Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Join WhatsApp</span>
          </a>

          {/* Telegram Button */}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '0.88rem 1.25rem',
              borderRadius: '14px',
              backgroundColor: '#0088CC',
              color: '#FFFFFF',
              fontSize: '0.96rem',
              fontWeight: 800,
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 136, 204, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0077B5';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 136, 204, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0088CC';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 136, 204, 0.3)';
            }}
          >
            {/* Telegram SVG Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            <span>Join Telegram</span>
          </a>
        </div>

        {/* Bottom Subtle Note */}
        <div style={{
          marginTop: '1.15rem',
          textAlign: 'center',
          fontSize: '0.72rem',
          color: '#9E9486',
          fontWeight: 500
        }}>
          Never miss an update • Free to join • No spam
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scPopupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scPopupFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scCardSlideIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes scCardSlideOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.92) translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}
