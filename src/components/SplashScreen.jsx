import React, { useState, useEffect, useRef } from 'react';

/**
 * SplashScreen — Official Full-Screen Launch Screen for Professor Virus
 * 
 * Renders an edge-to-edge, responsive splash screen for BOTH Mobile and Desktop.
 * - Desktop: 16:9 landscape composition matching desktop reference image
 * - Mobile: Portrait composition matching mobile reference image
 * - SVG vector waves with burgundy gradients and metallic gold ribbon strokes
 * - Academic doodles (books, mortarboard, notes document, lightbulb) and star sparkles
 * - Official 3D metallic PV emblem (/assets/pv_emblem_transparent.png)
 * - Brand typography: PROFESSOR VIRUS, subtitle, graduation cap divider, tagline
 * - Gold-to-burgundy animated progress bar, dynamic status, and pulsing dots
 * - Smooth 350ms fade-out and unmount with fail-safe timeout protection
 * - Honors prefers-reduced-motion
 */
export default function SplashScreen({ onFinish }) {
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
    // Check if user prefers reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setProgress(100);
      const instantTimer = setTimeout(() => {
        handleComplete();
      }, 500);
      return () => clearTimeout(instantTimer);
    }

    // Smooth progress incrementation over ~1.8 seconds
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

    // Failsafe timeout: user is never trapped, dismisses after 2.6s maximum
    const failsafeTimer = setTimeout(() => {
      handleComplete();
    }, 2600);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      clearTimeout(failsafeTimer);
    };
  }, [onFinish]);

  if (!isMounted) return null;

  // Dynamic status messages based on current loading progress (mobile)
  let mobileMessage = 'Initializing your learning space...';
  if (progress >= 85) {
    mobileMessage = 'Almost ready...';
  } else if (progress >= 55) {
    mobileMessage = 'Loading your student dashboard...';
  } else if (progress >= 25) {
    mobileMessage = 'Preparing notes and PYQs...';
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Professor Virus"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
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
      {/* 1. TOP-LEFT WAVES */}
      {/* Mobile Wave */}
      <div className="pv-top-wave-container pv-mobile-only">
        <svg viewBox="0 0 280 145" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="pvTopBurgundyM" x1="0%" y1="0%" x2="100%" y2="85%">
              <stop offset="0%" stopColor="#4B080D" />
              <stop offset="50%" stopColor="#72141B" />
              <stop offset="100%" stopColor="#8E1C25" />
            </linearGradient>
            <linearGradient id="pvTopGoldM" x1="0%" y1="0%" x2="100%" y2="70%">
              <stop offset="0%" stopColor="#C28B2B" />
              <stop offset="35%" stopColor="#FCEAB8" />
              <stop offset="65%" stopColor="#E2B44C" />
              <stop offset="100%" stopColor="#C28B2B" />
            </linearGradient>
          </defs>
          <path d="M 0,0 L 0,135 Q 70,115 130,68 T 260,0 Z" fill="#F8EEDC" opacity="0.6" />
          <path d="M 0,0 L 0,118 Q 65,100 120,56 T 240,0 Z" fill="url(#pvTopBurgundyM)" />
          <path d="M 0,118 Q 65,100 120,56 T 240,0" fill="none" stroke="url(#pvTopGoldM)" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M 0,126 Q 68,107 124,62 T 250,0" fill="none" stroke="#EED9B2" strokeWidth="1.8" opacity="0.85" />
        </svg>
      </div>

      {/* Desktop Wave */}
      <div className="pv-top-wave-container pv-desktop-only">
        <svg viewBox="0 0 500 240" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="pvTopBurgundyD" x1="0%" y1="0%" x2="100%" y2="85%">
              <stop offset="0%" stopColor="#4B080D" />
              <stop offset="50%" stopColor="#72141B" />
              <stop offset="100%" stopColor="#8E1C25" />
            </linearGradient>
            <linearGradient id="pvTopGoldD" x1="0%" y1="0%" x2="100%" y2="70%">
              <stop offset="0%" stopColor="#C28B2B" />
              <stop offset="35%" stopColor="#FCEAB8" />
              <stop offset="65%" stopColor="#E2B44C" />
              <stop offset="100%" stopColor="#C28B2B" />
            </linearGradient>
          </defs>
          <path d="M 0,0 L 0,210 Q 140,180 260,110 T 480,0 Z" fill="#F8EEDC" opacity="0.6" />
          <path d="M 0,0 L 0,185 Q 130,155 240,90 T 450,0 Z" fill="url(#pvTopBurgundyD)" />
          <path d="M 0,185 Q 130,155 240,90 T 450,0" fill="none" stroke="url(#pvTopGoldD)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 0,195 Q 135,165 245,98 T 465,0" fill="none" stroke="#EED9B2" strokeWidth="2" opacity="0.85" />
          <polygon points="175,130 177,135 182,137 177,139 175,144 173,139 168,137 173,135" fill="#FFF5D6" />
          <circle cx="175" cy="137" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* 2. ACADEMIC DOODLES */}
      {/* Mobile Doodles */}
      <div className="pv-mobile-only" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <svg className="pv-doodle" style={{ top: '14%', left: '8%', width: '78px', height: '62px', transform: 'rotate(14deg)' }} viewBox="0 0 24 24" fill="none" stroke="#CD9E56" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <svg className="pv-doodle" style={{ top: '14%', right: '8%', width: '74px', height: '62px', transform: 'rotate(-12deg)' }} viewBox="0 0 24 24" fill="none" stroke="#CD9E56" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
        </svg>
        <svg className="pv-doodle" style={{ bottom: '16%', left: '7%', width: '62px', height: '72px', transform: 'rotate(-8deg)' }} viewBox="0 0 24 24" fill="none" stroke="#CD9E56" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/>
        </svg>
        <svg className="pv-doodle" style={{ bottom: '16%', right: '8%', width: '60px', height: '70px', transform: 'rotate(12deg)' }} viewBox="0 0 24 24" fill="none" stroke="#CD9E56" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/>
        </svg>
        <svg className="pv-sparkle" style={{ top: '27%', left: '7%', width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="#E5B85C"><path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/></svg>
        <svg className="pv-sparkle" style={{ top: '28%', right: '7%', width: '20px', height: '20px', animationDelay: '0.9s' }} viewBox="0 0 24 24" fill="#E5B85C"><path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/></svg>
        <svg className="pv-sparkle" style={{ bottom: '27%', left: '6%', width: '24px', height: '24px', animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="#E5B85C"><path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/></svg>
        <svg className="pv-sparkle" style={{ bottom: '28%', right: '6%', width: '21px', height: '21px', animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="#E5B85C"><path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/></svg>
      </div>

      {/* Desktop Doodles */}
      <div className="pv-desktop-only" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <svg className="pv-doodle" style={{ top: '22%', left: '16%', width: '72px', height: '58px', transform: 'rotate(14deg)' }} viewBox="0 0 24 24" fill="none" stroke="#CD9E56" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <svg className="pv-doodle" style={{ top: '20%', right: '17%', width: '70px', height: '58px', transform: 'rotate(-12deg)' }} viewBox="0 0 24 24" fill="none" stroke="#CD9E56" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
        </svg>
        <svg className="pv-doodle" style={{ top: '50%', left: '13%', width: '60px', height: '70px', transform: 'rotate(-8deg)' }} viewBox="0 0 24 24" fill="none" stroke="#CD9E56" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/>
        </svg>
        <svg className="pv-doodle" style={{ top: '52%', right: '15%', width: '56px', height: '66px', transform: 'rotate(12deg)' }} viewBox="0 0 24 24" fill="none" stroke="#CD9E56" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/>
        </svg>
        <svg className="pv-sparkle" style={{ top: '32%', left: '28%', width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="#E5B85C"><path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/></svg>
        <svg className="pv-sparkle" style={{ top: '30%', right: '28%', width: '20px', height: '20px', animationDelay: '0.9s' }} viewBox="0 0 24 24" fill="#E5B85C"><path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/></svg>
        <svg className="pv-sparkle" style={{ bottom: '35%', left: '6%', width: '22px', height: '22px', animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="#E5B85C"><path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/></svg>
        <svg className="pv-sparkle" style={{ top: '18%', right: '35%', width: '18px', height: '18px', animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="#E5B85C"><path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/></svg>
      </div>

      {/* 3. CENTER COMPOSITION */}
      <div className="pv-composition">
        {/* 3D PV Emblem */}
        <div className="pv-emblem-box">
          <img
            src="/assets/pv_emblem_transparent.png"
            alt="Professor Virus 3D Emblem"
            className="pv-emblem-img"
            onError={() => handleComplete()}
          />
        </div>

        {/* Brand Information */}
        <div className="pv-brand-box">
          <div className="pv-title">
            <span className="pv-title-navy">PROFESSOR</span>
            <span className="pv-title-burgundy">VIRUS</span>
          </div>

          <div className="pv-subtitle">
            NOTES • PYQ • TOOLS • ALL COURSES
          </div>

          <div className="pv-divider">
            <div className="pv-div-line" />
            <svg width="22" height="18" viewBox="0 0 24 24" fill="#C28B2B">
              <path d="M12 3 L1 9 L12 15 L23 9 Z" />
              <path d="M5 11.5 L5 16.5 C5 18.5 8.1 20.5 12 20.5 C15.9 20.5 19 18.5 19 16.5 L19 11.5" fill="none" stroke="#C28B2B" strokeWidth="2" />
              <path d="M22 9 L22 17" stroke="#C28B2B" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="22" cy="18" r="1.5" fill="#C28B2B"/>
            </svg>
            <div className="pv-div-line" />
          </div>

          <div className="pv-tagline">
            Study Smart. Prepare Better.
          </div>
        </div>

        {/* Loading Progress Section */}
        <div className="pv-loading-box">
          <div className="pv-bar-row">
            <div className="pv-bar-track">
              <div
                className="pv-bar-fill"
                style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
              />
            </div>
            <div className="pv-pct-text pv-mobile-only">
              {progress}%
            </div>
          </div>

          <div className="pv-status-msg pv-mobile-only">
            {mobileMessage}
          </div>
          <div className="pv-status-msg pv-desktop-only">
            Loading...
          </div>

          <div className="pv-dots-row">
            <div className="pv-dot" />
            <div className="pv-dot" />
            <div className="pv-dot" />
          </div>
        </div>

        {/* Quote Pill (Mobile only) */}
        <div className="pv-quote-box">
          <div className="pv-quote-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#DE9E35">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z"/>
            </svg>
            <div className="pv-quote-div" />
            <span>&ldquo;Better Preparation. Brighter Future.&rdquo;</span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM FLOWING WAVES */}
      {/* Mobile Wave */}
      <div className="pv-bot-wave-container pv-mobile-only">
        <svg viewBox="0 0 400 160" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="pvBotBurgundy1M" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B141B" />
              <stop offset="60%" stopColor="#550B10" />
              <stop offset="100%" stopColor="#3A0508" />
            </linearGradient>
            <linearGradient id="pvBotBurgundy2M" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#931C24" />
              <stop offset="50%" stopColor="#6F1218" />
              <stop offset="100%" stopColor="#4B080D" />
            </linearGradient>
            <linearGradient id="pvBotGoldM" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B88022" />
              <stop offset="35%" stopColor="#FCEAB8" />
              <stop offset="65%" stopColor="#E2B44C" />
              <stop offset="100%" stopColor="#C28B2B" />
            </linearGradient>
            <linearGradient id="pvBotGoldSoftM" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EBD09C" />
              <stop offset="50%" stopColor="#FFF0D0" />
              <stop offset="100%" stopColor="#D9A952" />
            </linearGradient>
          </defs>
          <path d="M 0,85 Q 90,38 185,62 T 400,20 L 400,160 L 0,160 Z" fill="#F8EEDC" opacity="0.6" />
          <path d="M 0,68 Q 100,22 205,48 T 400,12 L 400,160 L 0,160 Z" fill="url(#pvBotBurgundy1M)" />
          <path d="M 0,68 Q 100,22 205,48 T 400,12" fill="none" stroke="url(#pvBotGoldSoftM)" strokeWidth="1.8" opacity="0.8" />
          <path d="M 0,92 Q 120,38 235,72 T 400,34 L 400,160 L 0,160 Z" fill="url(#pvBotBurgundy2M)" />
          <path d="M 0,92 Q 120,38 235,72 T 400,34" fill="none" stroke="url(#pvBotGoldM)" strokeWidth="3.6" strokeLinecap="round" />
          <polygon points="325,44 327,49 332,51 327,53 325,58 323,53 318,51 323,49" fill="#FFF5D6" />
          <circle cx="325" cy="51" r="1.5" fill="#FFFFFF" />
          <polygon points="135,54 136.5,58 141,59.5 136.5,61 135,65 133.5,61 129,59.5 133.5,58" fill="#FFF5D6" opacity="0.9" />
        </svg>
      </div>

      {/* Desktop Wave */}
      <div className="pv-bot-wave-container pv-desktop-only">
        <svg viewBox="0 0 1200 240" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="pvBotBurgundy1D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B141B" />
              <stop offset="60%" stopColor="#550B10" />
              <stop offset="100%" stopColor="#3A0508" />
            </linearGradient>
            <linearGradient id="pvBotBurgundy2D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#931C24" />
              <stop offset="50%" stopColor="#6F1218" />
              <stop offset="100%" stopColor="#4B080D" />
            </linearGradient>
            <linearGradient id="pvBotGoldD" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B88022" />
              <stop offset="25%" stopColor="#FCEAB8" />
              <stop offset="55%" stopColor="#E2B44C" />
              <stop offset="85%" stopColor="#FCEAB8" />
              <stop offset="100%" stopColor="#B88022" />
            </linearGradient>
            <linearGradient id="pvBotGoldSoftD" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EBD09C" />
              <stop offset="50%" stopColor="#FFF0D0" />
              <stop offset="100%" stopColor="#D9A952" />
            </linearGradient>
          </defs>
          <path d="M 0,110 Q 180,40 380,85 T 850,55 Q 1040,30 1200,60 L 1200,240 L 0,240 Z" fill="#F8EEDC" opacity="0.6" />
          <path d="M 0,85 Q 220,25 450,75 T 920,40 Q 1080,20 1200,45 L 1200,240 L 0,240 Z" fill="url(#pvBotBurgundy1D)" />
          <path d="M 0,85 Q 220,25 450,75 T 920,40 Q 1080,20 1200,45" fill="none" stroke="url(#pvBotGoldSoftD)" strokeWidth="2" opacity="0.8" />
          <path d="M 0,125 Q 240,45 520,105 T 1000,55 Q 1120,35 1200,70 L 1200,240 L 0,240 Z" fill="url(#pvBotBurgundy2D)" />
          <path d="M 0,125 Q 240,45 520,105 T 1000,55 Q 1120,35 1200,70" fill="none" stroke="url(#pvBotGoldD)" strokeWidth="4.5" strokeLinecap="round" />
          <polygon points="120,100 122,105 127,107 122,109 120,114 118,109 113,107 118,105" fill="#FFF5D6" />
          <circle cx="120" cy="107" r="1.5" fill="#FFFFFF" />
          <polygon points="310,65 311.5,69 316,70.5 311.5,72 310,76 308.5,72 304,70.5 308.5,69" fill="#FFF5D6" />
          <circle cx="310" cy="70.5" r="1.2" fill="#FFFFFF" />
          <polygon points="1080,48 1082,53 1087,55 1082,57 1080,62 1078,57 1073,55 1078,53" fill="#FFF5D6" />
          <circle cx="1080" cy="55" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Scoped Keyframes and Responsive Media Queries */}
      <style>{`
        /* RESPONSIVE DISPLAY SWITCHING */
        .pv-desktop-only { display: none !important; }
        .pv-mobile-only { display: block !important; }
        @media (min-width: 1024px) {
          .pv-desktop-only { display: block !important; }
          .pv-mobile-only { display: none !important; }
        }

        /* TOP-LEFT WAVE */
        .pv-top-wave-container {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
          width: 58%;
          height: 14%;
          min-height: 110px;
          max-height: 150px;
        }
        @media (min-width: 1024px) {
          .pv-top-wave-container {
            width: 44%;
            height: 30%;
            min-width: 360px;
            min-height: 150px;
            max-height: 250px;
          }
        }

        /* BOTTOM WAVE */
        .pv-bot-wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          pointer-events: none;
          z-index: 1;
          height: 20%;
          min-height: 140px;
          max-height: 210px;
        }
        @media (min-width: 1024px) {
          .pv-bot-wave-container {
            height: 27%;
            min-height: 150px;
            max-height: 250px;
          }
        }

        /* DOODLES & SPARKLES */
        .pv-doodle {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
        }
        .pv-sparkle {
          position: absolute;
          pointer-events: none;
          z-index: 2;
          animation: pvSparklePulse 2.6s infinite ease-in-out;
        }
        @keyframes pvSparklePulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        /* CENTER COMPOSITION */
        .pv-composition {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          z-index: 5;
          width: 100%;
          height: 100%;
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        /* 3D EMBLEM */
        .pv-emblem-box {
          position: absolute;
          top: 22%;
          width: min(340px, 74vw);
          height: min(340px, 74vw);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pvEmblemDrop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (min-width: 1024px) {
          .pv-emblem-box {
            top: 13.5%;
            width: min(225px, 21vw);
            height: min(225px, 21vw);
          }
        }
        @keyframes pvEmblemDrop {
          0% { opacity: 0; transform: scale(0.92) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .pv-emblem-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 18px 36px rgba(110, 15, 20, 0.24));
        }
        @media (min-width: 1024px) {
          .pv-emblem-img {
            filter: drop-shadow(0 14px 28px rgba(110, 15, 20, 0.22));
          }
        }

        /* BRAND INFORMATION */
        .pv-brand-box {
          position: absolute;
          top: 51.5%;
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 16px;
        }
        @media (min-width: 1024px) {
          .pv-brand-box {
            top: 52%;
            max-width: 500px;
          }
        }

        .pv-title {
          font-size: clamp(28px, 8vw, 36px);
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1.1;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }
        @media (min-width: 1024px) {
          .pv-title {
            font-size: clamp(27px, 2.7vw, 35px);
            margin-bottom: 5px;
          }
        }
        .pv-title-navy { color: #10223D; }
        .pv-title-burgundy { color: #7B151C; }

        .pv-subtitle {
          font-size: 11.5px;
          font-weight: 850;
          letter-spacing: 0.28em;
          color: #1E293B;
          text-transform: uppercase;
          margin-bottom: 12px;
          width: 100%;
          max-width: 360px;
        }
        @media (min-width: 1024px) {
          .pv-subtitle {
            font-size: 11.5px;
            letter-spacing: 0.28em;
            margin-bottom: 9px;
          }
        }

        .pv-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          max-width: 350px;
          margin-bottom: 12px;
        }
        @media (min-width: 1024px) {
          .pv-divider {
            max-width: 290px;
            margin-bottom: 9px;
          }
        }
        .pv-div-line {
          flex: 1;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #C88D2D 35%, #C88D2D 65%, transparent);
          border-radius: 9999px;
        }

        .pv-tagline {
          font-size: clamp(17px, 4.8vw, 21px);
          font-weight: 600;
          color: #1F2D3D;
          letter-spacing: 0.02em;
          font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
        }
        @media (min-width: 1024px) {
          .pv-tagline {
            font-size: clamp(15px, 1.4vw, 18px);
          }
        }

        /* LOADING PROGRESS */
        .pv-loading-box {
          position: absolute;
          top: 67%;
          width: 100%;
          max-width: 310px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 20px;
        }
        @media (min-width: 1024px) {
          .pv-loading-box {
            top: 74%;
            max-width: 290px;
            padding: 0 16px;
          }
        }

        .pv-bar-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 9px;
        }
        @media (min-width: 1024px) {
          .pv-bar-row {
            margin-bottom: 8px;
          }
        }
        .pv-bar-track {
          flex: 1;
          height: 10px;
          background-color: #F4EAE0;
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid #E6D8C4;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
          position: relative;
        }
        @media (min-width: 1024px) {
          .pv-bar-track {
            height: 9px;
          }
        }
        .pv-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #E0A034 0%, #BA4428 55%, #78141B 100%);
          border-radius: 9999px;
          box-shadow: 0 1px 6px rgba(120, 20, 27, 0.35);
        }
        .pv-pct-text {
          font-size: 13.5px;
          font-weight: 900;
          color: #10223D;
          min-width: 36px;
          text-align: right;
        }

        .pv-status-msg {
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 9px;
          min-height: 18px;
          letter-spacing: 0.01em;
        }
        @media (min-width: 1024px) {
          .pv-status-msg {
            font-size: 12px;
            margin-bottom: 8px;
          }
        }

        .pv-dots-row {
          display: flex;
          gap: 6px;
          align-items: center;
          justify-content: center;
        }
        .pv-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pvDotPulse 1.4s infinite ease-in-out;
        }
        @media (min-width: 1024px) {
          .pv-dot { width: 5.5px; height: 5.5px; }
        }
        .pv-dot:nth-child(1) { background-color: #D6A13D; animation-delay: 0s; }
        .pv-dot:nth-child(2) { background-color: #7B151C; animation-delay: 0.2s; }
        .pv-dot:nth-child(3) { background-color: #E2B860; animation-delay: 0.4s; }
        @keyframes pvDotPulse {
          0%, 100% { transform: scale(0.8); opacity: 0.35; }
          50% { transform: scale(1.35); opacity: 1; }
        }

        /* QUOTE PILL (Mobile Portrait) */
        .pv-quote-box {
          position: absolute;
          top: 77.2%;
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 0 16px;
        }
        @media (min-width: 1024px) {
          .pv-quote-box {
            display: none !important;
          }
        }
        .pv-quote-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 252, 247, 0.96);
          border: 1px solid #ECE0CF;
          padding: 7px 20px;
          border-radius: 9999px;
          box-shadow: 0 3px 12px rgba(170, 120, 50, 0.08);
        }
        .pv-quote-pill span {
          font-size: 11.5px;
          font-weight: 600;
          color: #475569;
          letter-spacing: 0.015em;
        }
        .pv-quote-div {
          width: 1px;
          height: 12px;
          background-color: #E2D3BE;
        }

        @media (prefers-reduced-motion: reduce) {
          .pv-sparkle, .pv-dot, .pv-emblem-box {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
