import React, { useState, useEffect } from 'react';

/**
 * MobileSplashScreen — Native App-Style In-App Launch Screen
 * 
 * Rules:
 * - Rendered ONLY on mobile devices (< 1024px) during initial page load / refresh.
 * - Desktop (>= 1024px) completely bypasses this screen with zero delay.
 * - Warm ivory background (#FFFCF7).
 * - Official Professor Virus logo with gentle scale/fade-in.
 * - Brand heading: "PROFESSOR VIRUS" (Navy & Burgundy).
 * - Tagline: "Study Smart. Prepare Better."
 * - Thin animated gold loading indicator (#D6A13D).
 * - Minimum display time: ~1.4s, then smooth 350ms fade-out.
 * - Never traps the user: errors or timeouts dismiss cleanly.
 */
export default function MobileSplashScreen({ onFinish }) {
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Only display on mobile screen sizes
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (onFinish) onFinish();
      setIsMounted(false);
      return;
    }

    // 1. Minimum display time: 1.4 seconds for smooth native app feel
    const timer = setTimeout(() => {
      setIsFading(true);
      // 2. Allow 350ms for CSS fade-out transition before unmounting
      const fadeTimer = setTimeout(() => {
        setIsMounted(false);
        if (onFinish) onFinish();
      }, 350);
      return () => clearTimeout(fadeTimer);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isMounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Professor Virus"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#FFFCF7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'calc(2.5rem + env(safe-area-inset-top, 0px)) 1.5rem calc(2rem + env(safe-area-inset-bottom, 0px))',
        boxSizing: 'border-box',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {/* Top Spacer / Subtle Status Bar Spacing */}
      <div style={{ width: '100%', height: '20px' }} />

      {/* Center Branding & Mascot */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          animation: 'pvSplashScaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Logo Badge with Dual Burgundy & Gold Rings */}
        <div
          style={{
            position: 'relative',
            width: '92px',
            height: '92px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Subtle Outer Glow */}
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(214, 161, 61, 0.25) 0%, rgba(134, 24, 32, 0.08) 70%, transparent 100%)',
              filter: 'blur(8px)',
              pointerEvents: 'none'
            }}
          />

          {/* Gold & Burgundy Outer Ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(135deg, #D6A13D 0%, #861820 100%)',
              boxShadow: '0 8px 24px rgba(134, 24, 32, 0.18)'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src="/assets/navbar_logo.png"
                alt="Professor Virus"
                style={{
                  width: '74px',
                  height: '74px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/logo.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div
          style={{
            fontSize: '1.65rem',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '0.04em',
            marginBottom: '0.45rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span style={{ color: '#14243D' }}>PROFESSOR</span>
          <span style={{ color: '#861820' }}>VIRUS</span>
        </div>

        {/* Tagline Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: '#F8EAC9',
            border: '1px solid #D6A13D',
            color: '#681016',
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
            boxShadow: '0 2px 6px rgba(214, 161, 61, 0.15)'
          }}
        >
          <span>Study Smart. Prepare Better.</span>
        </div>

        {/* Thin Animated Gold Loading Progress Bar */}
        <div
          style={{
            marginTop: '2.25rem',
            width: '130px',
            height: '3px',
            backgroundColor: '#E9D9CC',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, #D6A13D 0%, #861820 100%)',
              animation: 'pvSplashProgress 1.4s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          textAlign: 'center'
        }}
      >
        <span
          style={{
            fontSize: '0.66rem',
            fontWeight: 700,
            color: '#66758B',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          AKTU • B.Tech • Exam Preparation Platform
        </span>
      </div>

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes pvSplashScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(6px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes pvSplashProgress {
          0% {
            left: 0%;
            width: 0%;
          }
          50% {
            left: 20%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
