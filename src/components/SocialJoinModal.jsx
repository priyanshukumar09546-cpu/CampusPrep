import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink, MessageCircle, Send } from 'lucide-react';
import { SOCIAL_LINKS } from '../config/socialLinks';

const DISMISS_KEY = 'pv_social_join_dismissed_until';
const DISMISS_DAYS = 3;

export default function SocialJoinModal() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed
    try {
      const dismissedUntil = localStorage.getItem(DISMISS_KEY);
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        return; // Still dismissed
      }
    } catch { /* ignore */ }

    // Show after a short delay for better UX
    const timer = setTimeout(() => {
      setVisible(true);
      try { sessionStorage.setItem('pv_modal_shown_session', 'true'); } catch {}
      requestAnimationFrame(() => setAnimating(true));
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      try {
        const dismissUntil = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
        localStorage.setItem(DISMISS_KEY, String(dismissUntil));
      } catch { /* ignore */ }
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: animating ? 'rgba(0, 0, 0, 0.55)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: animating ? 'blur(6px)' : 'blur(0px)',
        WebkitBackdropFilter: animating ? 'blur(6px)' : 'blur(0px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        transition: 'all 0.3s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      {/* MODAL CARD */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E8E2D5',
          boxShadow: '0 32px 64px rgba(35, 30, 25, 0.18), 0 0 0 1px rgba(255,255,255,0.6) inset',
          width: '100%',
          maxWidth: '480px',
          padding: '2.5rem 2rem 2rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          transform: animating ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          opacity: animating ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Accent Gradient Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #25D366 0%, #C88D2D 50%, #229ED9 100%)'
        }} />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1.5px solid #E8E2D5',
            backgroundColor: '#FAF7F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            transition: 'all 0.2s ease',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#C88D2D';
            e.currentTarget.style.color = '#1F2421';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E8E2D5';
            e.currentTarget.style.color = '#64748B';
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        {/* ProfessorVirus Mascot Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '3px solid #C88D2D',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 20px rgba(200, 141, 45, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src="/assets/navbar_logo.png"
              alt="ProfessorVirus"
              style={{ width: '85%', height: '85%', objectFit: 'contain' }}
              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.65rem',
          fontWeight: 900,
          color: '#1F2421',
          textAlign: 'center',
          lineHeight: 1.2,
          margin: '0 0 0.6rem 0',
          letterSpacing: '-0.01em'
        }}>
          Stay Connected with{' '}
          <span style={{ color: '#C88D2D' }}>ProfessorVirus</span>
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '0.92rem',
          color: '#55606E',
          textAlign: 'center',
          lineHeight: 1.55,
          margin: '0 0 2rem 0',
          maxWidth: '380px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Get AKTU updates, notes, PYQs, jobs, internships and important announcements directly on WhatsApp and Telegram.
        </p>

        {/* CTA BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {/* WhatsApp Button */}
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              padding: '0.95rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 6px 18px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#20BD5A';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#25D366';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <MessageCircle size={20} />
            Join WhatsApp Channel
            <ExternalLink size={15} style={{ opacity: 0.7, marginLeft: '0.15rem' }} />
          </a>

          {/* Telegram Button */}
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              backgroundColor: '#229ED9',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              padding: '0.95rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 6px 18px rgba(34, 158, 217, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1B8FC5';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#229ED9';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Send size={20} />
            Join Telegram Group
            <ExternalLink size={15} style={{ opacity: 0.7, marginLeft: '0.15rem' }} />
          </a>
        </div>

        {/* Maybe Later Button */}
        <button
          onClick={handleDismiss}
          style={{
            display: 'block',
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#7A6F62',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '0.5rem',
            textAlign: 'center',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1F2421'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#7A6F62'}
        >
          Maybe later
        </button>

        {/* Subtle trust line */}
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.72rem',
          color: '#94A3B8',
          fontWeight: 600
        }}>
          <Sparkles size={12} />
          <span>Join 12,000+ AKTU students already connected</span>
        </div>
      </div>
    </div>
  );
}
