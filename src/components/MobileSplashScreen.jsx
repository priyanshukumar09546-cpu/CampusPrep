import React, { useState, useEffect, useRef } from 'react';

/**
 * MobileSplashScreen — Official Native-Style In-App Launch Screen
 * 
 * Rebuilt cleanly as a real, responsive, functional mobile component using HTML, CSS, SVG, and React.
 * Strictly mobile-only (< 1024px). Completely bypasses desktop (>= 1024px).
 * 
 * Features:
 * - Dynamic SVG waves with burgundy gradients and metallic gold ribbon strokes
 * - Academic doodles (open book, cap, notes, lightbulb) and 4-point sparkles
 * - Official Professor Virus 3D emblem (/assets/pv_emblem_transparent.png)
 * - Brand typography: PROFESSOR VIRUS, subtitle, graduation cap divider, tagline
 * - Functional progress bar (0% -> 100%), live percentage text, dynamic rotating status messages
 * - Quote pill: "Better Preparation. Brighter Future."
 * - Smooth 350ms fade-out and unmount with fail-safe timeout protection
 */
export default function MobileSplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const animRef = useRef(null);
  const finishedRef = useRef(false);

  // Complete and unmount splash screen smoothly
  const handleComplete = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFading(true);
    setTimeout(() => {
      setIsMounted(false);
      if (onFinish) onFinish();
    }, 350);
  };

  useEffect(() => {
    // 1. Desktop devices (>= 1024px) bypass immediately with zero delay
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (onFinish) onFinish();
      setIsMounted(false);
      return;
    }

    // 2. Real smooth progress incrementation over ~1.8 seconds
    const startTime = performance.now();
    const duration = 1800; // 1.8s

    const updateProgress = (now) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic curve
      const eased = 1 - Math.pow(1 - rawProgress, 2.5);
      const currentPct = Math.round(eased * 100);

      setProgress(currentPct);

      if (rawProgress < 1) {
        animRef.current = requestAnimationFrame(updateProgress);
      } else {
        // Complete when progress reaches 100%
        setTimeout(() => {
          handleComplete();
        }, 120);
      }
    };

    animRef.current = requestAnimationFrame(updateProgress);

    // 3. Failsafe timeout: user is never trapped, dismisses after 2.6s maximum
    const failsafeTimer = setTimeout(() => {
      handleComplete();
    }, 2600);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      clearTimeout(failsafeTimer);
    };
  }, [onFinish]);

  if (!isMounted) return null;

  // Dynamic status messages based on current loading progress
  let loadingMessage = 'Initializing your learning space...';
  if (progress >= 85) {
    loadingMessage = 'Almost ready...';
  } else if (progress >= 55) {
    loadingMessage = 'Loading your student dashboard...';
  } else if (progress >= 25) {
    loadingMessage = 'Preparing notes and PYQs...';
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Professor Virus"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#FDF9F3',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* 1. TOP-LEFT BURGUNDY & GOLD CORNER WAVES (SVG) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '58%',
          height: '14%',
          minHeight: '110px',
          maxHeight: '150px',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        <svg viewBox="0 0 280 145" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="pvTopBurgundy" x1="0%" y1="0%" x2="100%" y2="85%">
              <stop offset="0%" stopColor="#4B080D" />
              <stop offset="50%" stopColor="#72141B" />
              <stop offset="100%" stopColor="#8E1C25" />
            </linearGradient>
            <linearGradient id="pvTopGold" x1="0%" y1="0%" x2="100%" y2="70%">
              <stop offset="0%" stopColor="#C28B2B" />
              <stop offset="35%" stopColor="#FCEAB8" />
              <stop offset="65%" stopColor="#E2B44C" />
              <stop offset="100%" stopColor="#C28B2B" />
            </linearGradient>
          </defs>

          {/* Soft ivory accent back wave */}
          <path d="M 0,0 L 0,135 Q 70,115 130,68 T 260,0 Z" fill="#F8EEDC" opacity="0.6" />

          {/* Main rich burgundy corner shape */}
          <path d="M 0,0 L 0,118 Q 65,100 120,56 T 240,0 Z" fill="url(#pvTopBurgundy)" />

          {/* Flowing metallic gold ribbon border */}
          <path d="M 0,118 Q 65,100 120,56 T 240,0" fill="none" stroke="url(#pvTopGold)" strokeWidth="3.6" strokeLinecap="round" />

          {/* Secondary delicate champagne highlight */}
          <path d="M 0,126 Q 68,107 124,62 T 250,0" fill="none" stroke="#EED9B2" strokeWidth="1.8" opacity="0.85" />
        </svg>
      </div>

      {/* 2. BACKGROUND DOODLES (Academic Line Art SVGs) */}
      {/* Top-Left Open Book (Tilted 14deg) */}
      <svg
        style={{
          position: 'absolute',
          top: '14%',
          left: '8%',
          width: '78px',
          height: '62px',
          transform: 'rotate(14deg)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.35
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CD9E56"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>

      {/* Top-Right Mortarboard (Tilted -12deg) */}
      <svg
        style={{
          position: 'absolute',
          top: '14%',
          right: '8%',
          width: '74px',
          height: '62px',
          transform: 'rotate(-12deg)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.35
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CD9E56"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
      </svg>

      {/* Bottom-Left Notes Sheet (Tilted -8deg) */}
      <svg
        style={{
          position: 'absolute',
          bottom: '16%',
          left: '7%',
          width: '62px',
          height: '72px',
          transform: 'rotate(-8deg)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.35
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CD9E56"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="14" y2="17"/>
      </svg>

      {/* Bottom-Right Lightbulb (Tilted 12deg) */}
      <svg
        style={{
          position: 'absolute',
          bottom: '16%',
          right: '8%',
          width: '60px',
          height: '70px',
          transform: 'rotate(12deg)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.35
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CD9E56"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18h6"/>
        <path d="M10 22h4"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/>
      </svg>

      {/* 4-Point Floating Sparkles */}
      <svg
        className="pv-splash-sparkle"
        style={{ position: 'absolute', top: '27%', left: '7%', width: '22px', height: '22px', zIndex: 2 }}
        viewBox="0 0 24 24"
        fill="#E5B85C"
      >
        <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/>
      </svg>
      <svg
        className="pv-splash-sparkle"
        style={{ position: 'absolute', top: '28%', right: '7%', width: '20px', height: '20px', zIndex: 2, animationDelay: '0.9s' }}
        viewBox="0 0 24 24"
        fill="#E5B85C"
      >
        <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/>
      </svg>
      <svg
        className="pv-splash-sparkle"
        style={{ position: 'absolute', bottom: '27%', left: '6%', width: '24px', height: '24px', zIndex: 2, animationDelay: '1.4s' }}
        viewBox="0 0 24 24"
        fill="#E5B85C"
      >
        <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/>
      </svg>
      <svg
        className="pv-splash-sparkle"
        style={{ position: 'absolute', bottom: '28%', right: '6%', width: '21px', height: '21px', zIndex: 2, animationDelay: '0.5s' }}
        viewBox="0 0 24 24"
        fill="#E5B85C"
      >
        <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/>
      </svg>

      {/* 3. MAIN COMPOSITION CONTAINER (Accurate Proportional Layout) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          zIndex: 5,
          width: '100%',
          height: '100%',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* 3D PV Emblem */}
        <div
          style={{
            position: 'absolute',
            top: '22%',
            width: 'min(340px, 74vw)',
            height: 'min(340px, 74vw)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pvEmblemDrop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <img
            src="/assets/pv_emblem_transparent.png"
            alt="Professor Virus 3D Emblem"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 18px 36px rgba(110, 15, 20, 0.24))'
            }}
            onError={() => {
              // Failsafe: dismiss immediately if emblem image fails to load
              handleComplete();
            }}
          />
        </div>

        {/* Brand Information Stack below Emblem */}
        <div
          style={{
            position: 'absolute',
            top: '51.5%',
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 16px',
            boxSizing: 'border-box'
          }}
        >
          {/* PROFESSOR VIRUS Title */}
          <div
            style={{
              fontSize: 'clamp(28px, 8vw, 36px)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '9px'
            }}
          >
            <span style={{ color: '#10223D' }}>PROFESSOR</span>
            <span style={{ color: '#7B151C' }}>VIRUS</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 850,
              letterSpacing: '0.28em',
              color: '#1E293B',
              textTransform: 'uppercase',
              marginBottom: '12px',
              width: '100%',
              maxWidth: '360px'
            }}
          >
            NOTES • PYQ • TOOLS • ALL COURSES
          </div>

          {/* Graduation Cap Divider Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              maxWidth: '350px',
              marginBottom: '12px'
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent, #C88D2D 35%, #C88D2D 65%, transparent)',
                borderRadius: '9999px'
              }}
            />
            <svg width="22" height="18" viewBox="0 0 24 24" fill="#C28B2B">
              <path d="M12 3 L1 9 L12 15 L23 9 Z" />
              <path d="M5 11.5 L5 16.5 C5 18.5 8.1 20.5 12 20.5 C15.9 20.5 19 18.5 19 16.5 L19 11.5" fill="none" stroke="#C28B2B" strokeWidth="2" />
              <path d="M22 9 L22 17" stroke="#C28B2B" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="22" cy="18" r="1.5" fill="#C28B2B"/>
            </svg>
            <div
              style={{
                flex: 1,
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent, #C88D2D 35%, #C88D2D 65%, transparent)',
                borderRadius: '9999px'
              }}
            />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 'clamp(17px, 4.8vw, 21px)',
              fontWeight: 600,
              color: '#1F2D3D',
              letterSpacing: '0.02em',
              fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif"
            }}
          >
            Study Smart. Prepare Better.
          </div>
        </div>

        {/* Dynamic Loading Section Stack */}
        <div
          style={{
            position: 'absolute',
            top: '67%',
            width: '100%',
            maxWidth: '310px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 20px',
            boxSizing: 'border-box'
          }}
        >
          {/* Progress Bar & Percentage Row */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '9px'
            }}
          >
            <div
              style={{
                flex: 1,
                height: '10px',
                backgroundColor: '#F4EAE0',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '1px solid #E6D8C4',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #E0A034 0%, #BA4428 55%, #78141B 100%)',
                  borderRadius: '9999px',
                  boxShadow: '0 1px 6px rgba(120, 20, 27, 0.35)',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: 900,
                color: '#10223D',
                minWidth: '36px',
                textAlign: 'right'
              }}
            >
              {progress}%
            </div>
          </div>

          {/* Rotating Status Message */}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#475569',
              marginBottom: '9px',
              minHeight: '18px',
              letterSpacing: '0.01em'
            }}
          >
            {loadingMessage}
          </div>

          {/* 3 Animated Pulsing Dots */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              className="pv-splash-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#D6A13D',
                animationDelay: '0s'
              }}
            />
            <div
              className="pv-splash-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#7B151C',
                animationDelay: '0.2s'
              }}
            />
            <div
              className="pv-splash-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#E2B860',
                animationDelay: '0.4s'
              }}
            />
          </div>
        </div>

        {/* Bottom Quote Pill */}
        <div
          style={{
            position: 'absolute',
            top: '77.2%',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            padding: '0 16px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 252, 247, 0.96)',
              border: '1px solid #ECE0CF',
              padding: '7px 20px',
              borderRadius: '9999px',
              boxShadow: '0 3px 12px rgba(170, 120, 50, 0.08)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#DE9E35">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z"/>
            </svg>
            <div style={{ width: '1px', height: '12px', backgroundColor: '#E2D3BE' }} />
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#475569',
                letterSpacing: '0.015em'
              }}
            >
              &ldquo;Better Preparation. Brighter Future.&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM FLOWING BURGUNDY & GOLD WAVES (SVG) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '20%',
          minHeight: '140px',
          maxHeight: '210px',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        <svg viewBox="0 0 400 160" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="pvBotBurgundy1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B141B" />
              <stop offset="60%" stopColor="#550B10" />
              <stop offset="100%" stopColor="#3A0508" />
            </linearGradient>
            <linearGradient id="pvBotBurgundy2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#931C24" />
              <stop offset="50%" stopColor="#6F1218" />
              <stop offset="100%" stopColor="#4B080D" />
            </linearGradient>
            <linearGradient id="pvBotGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B88022" />
              <stop offset="35%" stopColor="#FCEAB8" />
              <stop offset="65%" stopColor="#E2B44C" />
              <stop offset="100%" stopColor="#C28B2B" />
            </linearGradient>
            <linearGradient id="pvBotGoldSoft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EBD09C" />
              <stop offset="50%" stopColor="#FFF0D0" />
              <stop offset="100%" stopColor="#D9A952" />
            </linearGradient>
          </defs>

          {/* Soft ivory accent back wave */}
          <path d="M 0,85 Q 90,38 185,62 T 400,20 L 400,160 L 0,160 Z" fill="#F8EEDC" opacity="0.6" />

          {/* Deep background burgundy wave */}
          <path d="M 0,68 Q 100,22 205,48 T 400,12 L 400,160 L 0,160 Z" fill="url(#pvBotBurgundy1)" />

          {/* Back wave gold trim */}
          <path d="M 0,68 Q 100,22 205,48 T 400,12" fill="none" stroke="url(#pvBotGoldSoft)" strokeWidth="1.8" opacity="0.8" />

          {/* Foreground sweeping burgundy wave */}
          <path d="M 0,92 Q 120,38 235,72 T 400,34 L 400,160 L 0,160 Z" fill="url(#pvBotBurgundy2)" />

          {/* Foreground primary metallic gold ribbon border */}
          <path d="M 0,92 Q 120,38 235,72 T 400,34" fill="none" stroke="url(#pvBotGold)" strokeWidth="3.6" strokeLinecap="round" />

          {/* Shiny star sparkles on wave peaks */}
          <polygon points="325,44 327,49 332,51 327,53 325,58 323,53 318,51 323,49" fill="#FFF5D6" />
          <circle cx="325" cy="51" r="1.5" fill="#FFFFFF" />
          <polygon points="135,54 136.5,58 141,59.5 136.5,61 135,65 133.5,61 129,59.5 133.5,58" fill="#FFF5D6" opacity="0.9" />
        </svg>
      </div>

      {/* Scoped Keyframe Animations */}
      <style>{`
        @keyframes pvEmblemDrop {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .pv-splash-sparkle {
          animation: pvSparklePulse 2.6s infinite ease-in-out;
        }
        @keyframes pvSparklePulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        .pv-splash-dot {
          animation: pvDotPulse 1.4s infinite ease-in-out;
        }
        @keyframes pvDotPulse {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.35);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
