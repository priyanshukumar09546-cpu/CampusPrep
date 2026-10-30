import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, ExternalLink, User, Users, Wallet, ShieldCheck } from 'lucide-react';

/**
 * MentorNearbyModal — Premium Tutor Registration Promotional Modal
 * Faithful implementation of Reference Image 2:
 * - Centered on screen (~500px desktop width, compact, balanced)
 * - Cream-colored translucent backdrop with light blur (NO black overlay)
 * - MentorNearby branding: logo + "Learn. Teach. Earn. Nearby."
 * - Two-line headline with vibrant purple/magenta gradient
 * - 4 Benefit Cards (desktop 4-col row, mobile 2x2 grid)
 * - Deep burgundy pill CTA button linking to https://mentornearby.com/
 * - Bottom promotional pill: "🎉 TUTOR LISTING LIVE NOW – FREE!"
 * - Festive celebration confetti accents
 * - Closes on (X), backdrop click, or Escape key
 */
export default function MentorNearbyModal({ isOpen, onClose }) {
  // Close on Escape key press
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose && onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Record interaction in localStorage so one-time instructional arrow is suppressed
    try {
      localStorage.setItem('pv_mentornearby_gift_interacted', 'true');
    } catch {
      // Ignore private browsing storage errors
    }

    // Lock page scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="pv-mentornearby-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pv-mentor-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(250, 245, 237, 0.74)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'pvModalFadeIn 0.24s ease-out forwards',
        overflowY: 'auto'
      }}
    >
      {/* Centered Modal Card Container */}
      <div
        className="pv-mentornearby-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '510px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid rgba(226, 232, 240, 0.95)',
          boxShadow: '0 25px 60px -10px rgba(120, 20, 22, 0.18), 0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(245, 158, 11, 0.12)',
          padding: '28px 24px 22px',
          textAlign: 'center',
          animation: 'pvModalScaleUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          boxSizing: 'border-box'
        }}
      >
        {/* =====================================================================
            FESTIVE CONFETTI STREAMERS (Matches Reference Image 2)
            ===================================================================== */}
        {/* Top-Left Pink Swirl */}
        <div style={{ position: 'absolute', top: '-14px', left: '-12px', pointerEvents: 'none', zIndex: 10 }}>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <path d="M 6 36 C 8 22, 24 28, 20 14 C 18 8, 30 6, 36 10" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
            <circle cx="10" cy="12" r="3" fill="#F59E0B" />
            <circle cx="34" cy="28" r="2.5" fill="#8B5CF6" />
          </svg>
        </div>

        {/* Top-Right Gold Sparkle / Confetti */}
        <div style={{ position: 'absolute', top: '-10px', right: '36px', pointerEvents: 'none', zIndex: 10 }}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M 17 2 L 19 12 L 29 14 L 20 19 L 23 29 L 16 22 L 8 27 L 12 18 L 4 14 L 14 13 Z" fill="#FBBF24" opacity="0.9" />
          </svg>
        </div>

        {/* Mid-Left Gold Ribbon Loop */}
        <div style={{ position: 'absolute', top: '48%', left: '-16px', pointerEvents: 'none', zIndex: 10 }}>
          <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
            <path d="M 4 8 C 16 10, 26 22, 14 30 C 8 34, 4 28, 12 20" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.85" />
          </svg>
        </div>

        {/* Mid-Right Magenta Streamer */}
        <div style={{ position: 'absolute', top: '46%', right: '-14px', pointerEvents: 'none', zIndex: 10 }}>
          <svg width="30" height="36" viewBox="0 0 30 36" fill="none">
            <path d="M 24 6 C 14 12, 6 22, 18 30" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.8" />
            <circle cx="8" cy="10" r="2" fill="#FBBF24" />
          </svg>
        </div>

        {/* Bottom-Left Pink Confetti Streamer */}
        <div style={{ position: 'absolute', bottom: '-8px', left: '-8px', pointerEvents: 'none', zIndex: 10 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M 8 28 C 16 20, 24 24, 28 12" stroke="#FB7185" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
            <circle cx="28" cy="26" r="2.5" fill="#F59E0B" />
          </svg>
        </div>

        {/* Bottom-Right Golden Streamer */}
        <div style={{ position: 'absolute', bottom: '-10px', right: '-8px', pointerEvents: 'none', zIndex: 10 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M 28 28 C 18 22, 12 26, 8 14" stroke="#F43F5E" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.85" />
            <circle cx="10" cy="28" r="2.5" fill="#FBBF24" />
          </svg>
        </div>

        {/* =====================================================================
            TOP RIGHT CIRCULAR CLOSE BUTTON (X)
            ===================================================================== */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="pv-mentor-modal-close"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            zIndex: 20
          }}
        >
          <X size={17} strokeWidth={2.4} />
        </button>

        {/* =====================================================================
            BRAND HEADER: MENTORNEARBY LOGO & TAGLINE
            ===================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}>
          {/* Logo + Brand Name */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {/* Vector Graduation Cap + Books Icon */}
            <svg width="36" height="32" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Stylized Open Book Pages at bottom */}
              <path d="M 4 28 C 11 26, 17 28, 19 31 C 21 28, 27 26, 34 28 L 34 22 C 27 20, 21 22, 19 25 C 17 22, 11 20, 4 22 Z" fill="#0284C7" />
              <path d="M 19 25 L 19 31" stroke="#FFFFFF" strokeWidth="1.5" />
              <path d="M 7 24 C 12 22, 17 23, 19 26 C 21 23, 26 22, 31 24 L 31 19 C 26 17, 21 18, 19 21 C 17 18, 12 17, 7 19 Z" fill="#E11D48" opacity="0.95" />
              {/* Graduation Cap */}
              <polygon points="19,5 37,12 19,19 1,12" fill="#1E293B" />
              {/* Cap Base */}
              <path d="M 9 15.5 L 9 20 C 9 23, 19 25, 29 20 L 29 15.5" fill="#0F172A" />
              {/* Cap Tassel */}
              <path d="M 28 15.5 L 33 21 C 34 22, 34 24, 33 25" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <circle cx="33" cy="25" r="1.5" fill="#F59E0B" />
              <circle cx="19" cy="12" r="1.6" fill="#FBBF24" />
            </svg>

            {/* Brand Title: MentorNearby */}
            <div style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '1.45rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              <span style={{ color: '#0F172A' }}>Mentor</span>
              <span style={{ color: '#E11D48' }}>Nearby</span>
            </div>
          </div>

          {/* Sub-tagline */}
          <div style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#64748B',
            letterSpacing: '0.04em',
            marginTop: '3px'
          }}>
            Learn. Teach. Earn. Nearby.
          </div>
        </div>

        {/* =====================================================================
            HEADLINE (Matches Reference Image 2)
            ===================================================================== */}
        <div style={{ marginBottom: '8px' }}>
          {/* Line 1 */}
          <h2
            id="pv-mentor-modal-title"
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 'clamp(1.15rem, 3.2vw, 1.35rem)',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 2px 0',
              lineHeight: 1.25,
              letterSpacing: '-0.015em'
            }}
          >
            Want to Become a
          </h2>

          {/* Line 2 with Gradient Highlights */}
          <div style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: 'clamp(1.18rem, 3.4vw, 1.42rem)',
            fontWeight: 900,
            lineHeight: 1.25,
            letterSpacing: '-0.015em',
            color: '#0F172A'
          }}>
            <span style={{
              background: 'linear-gradient(90deg, #A21CAF 0%, #C026D3 50%, #E11D48 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Home Tutor
            </span>
            <span> and Make </span>
            <span style={{
              background: 'linear-gradient(90deg, #A21CAF 0%, #C026D3 50%, #E11D48 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Earn Money?
            </span>
          </div>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#475569',
          lineHeight: 1.45,
          margin: '0 auto 16px',
          maxWidth: '430px'
        }}>
          Join MentorNearby – India's trusted tutor listing platform for students and teachers.
        </p>

        {/* =====================================================================
            4 BENEFIT CARDS (Desktop: 4 columns in 1 row; Mobile: 2x2 grid)
            ===================================================================== */}
        <div
          className="pv-mentor-benefit-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '18px'
          }}
        >
          {/* Card 1: Create Profile */}
          <div className="pv-mentor-card-item">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFE4E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E11D48',
              marginBottom: '6px'
            }}>
              <User size={18} strokeWidth={2.4} />
            </div>
            <div className="pv-mentor-card-title">
              Create Your<br />Tutor Profile
            </div>
            <div className="pv-mentor-card-sub">
              in 2 Minutes
            </div>
          </div>

          {/* Card 2: Get Students Nearby */}
          <div className="pv-mentor-card-item">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F3E8FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9333EA',
              marginBottom: '6px'
            }}>
              <Users size={18} strokeWidth={2.4} />
            </div>
            <div className="pv-mentor-card-title">
              Get Students<br />Nearby
            </div>
            <div className="pv-mentor-card-sub">
              in Your Area
            </div>
          </div>

          {/* Card 3: Start Earning */}
          <div className="pv-mentor-card-item">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
              marginBottom: '6px'
            }}>
              <Wallet size={18} strokeWidth={2.4} />
            </div>
            <div className="pv-mentor-card-title">
              Start Earning
            </div>
            <div className="pv-mentor-card-sub">
              on Your Schedule
            </div>
          </div>

          {/* Card 4: 100% Free Listing */}
          <div className="pv-mentor-card-item">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              marginBottom: '6px'
            }}>
              <ShieldCheck size={18} strokeWidth={2.4} />
            </div>
            <div className="pv-mentor-card-title">
              100% Free<br />Listing
            </div>
            <div className="pv-mentor-card-sub">
              No Charges!
            </div>
          </div>
        </div>

        {/* =====================================================================
            CTA BUTTON: REGISTER NOW -> (Opens https://mentornearby.com/ in new tab)
            ===================================================================== */}
        <div style={{ marginBottom: '14px' }}>
          <a
            href="https://mentornearby.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="pv-mentor-register-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              width: '100%',
              maxWidth: '380px',
              padding: '0.85rem 1.85rem',
              background: 'linear-gradient(135deg, #781416 0%, #631012 50%, #4C0B0D 100%)',
              color: '#FFFFFF',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '1.02rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              textDecoration: 'none',
              borderRadius: '9999px',
              border: '1.2px solid rgba(254, 240, 138, 0.4)',
              boxShadow: '0 8px 24px rgba(120, 20, 22, 0.4), 0 0 16px rgba(245, 158, 11, 0.25)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <span>Register Now</span>
            <ArrowRight size={18} strokeWidth={2.5} />
            <ExternalLink size={15} style={{ opacity: 0.85 }} />
          </a>
        </div>

        {/* =====================================================================
            BOTTOM PROMOTIONAL PILL BADGE (Matches Reference Image 2)
            ===================================================================== */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FFE4E6',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: '9999px',
              padding: '0.36rem 1.15rem',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#BE123C',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(244, 63, 94, 0.1)'
            }}
          >
            <span style={{ fontSize: '0.92rem' }}>🎉</span>
            <span>TUTOR LISTING LIVE NOW – FREE!</span>
          </div>
        </div>

        {/* Scoped CSS Styles for Modal Animations & Grid Responsiveness */}
        <style>{`
          @keyframes pvModalFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes pvModalScaleUp {
            from {
              opacity: 0;
              transform: scale(0.92) translateY(12px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .pv-mentor-modal-close:hover {
            background-color: #E2E8F0 !important;
            color: #0F172A !important;
            transform: rotate(90deg);
          }

          .pv-mentor-card-item {
            background: linear-gradient(180deg, #FAFAFA 0%, #F8FAFC 100%);
            border: 1px solid #E2E8F0;
            border-radius: 14px;
            padding: 10px 4px 9px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: all 0.18s ease;
          }

          .pv-mentor-card-item:hover {
            transform: translateY(-2px);
            border-color: #CBD5E1;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }

          .pv-mentor-card-title {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            font-size: 0.72rem;
            font-weight: 800;
            color: #0F172A;
            line-height: 1.2;
            margin-bottom: 2px;
          }

          .pv-mentor-card-sub {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            font-size: 0.64rem;
            font-weight: 600;
            color: #64748B;
            line-height: 1.15;
          }

          .pv-mentor-register-btn:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 12px 30px rgba(120, 20, 22, 0.52), 0 0 22px rgba(245, 158, 11, 0.4) !important;
            border-color: #FDE047 !important;
          }

          @media (max-width: 540px) {
            .pv-mentor-benefit-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 8px !important;
            }
            .pv-mentornearby-card {
              padding: 24px 16px 18px !important;
              border-radius: 20px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
