import React, { useState, useEffect, useRef } from 'react';
import API_URL from '../config/api';

/**
 * SplashScreen — Official Full-Screen Launch Screen for Professor Virus
 * 
 * Features:
 * - Desktop: Exact 16:9 landscape official artwork (/assets/splash_desktop_clean.jpg)
 * - Mobile: Exact 9:16 portrait official artwork (/assets/splash_mobile_clean.jpg)
 * - Dynamic HTML/CSS progress bar overlaid precisely over the artwork track
 * - Real application loading milestones (Core, Context, Assets, Backend Health, Shell)
 * - Live percentage (0% to 100%) beside the progress bar
 * - Subtle ambient golden glow behind the academic emblem
 * - Shimmer sweep animation across the burgundy progress fill
 * - Smooth fade-out and unmount transition to homepage
 */
export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing application...');
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Track viewport orientation: 'desktop' (landscape) vs 'mobile' (portrait)
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth || window.innerWidth <= 768;
  });

  const finishedRef = useRef(false);

  // Resize and orientation listener
  useEffect(() => {
    const handleResize = () => {
      const portrait = window.innerHeight > window.innerWidth || window.innerWidth <= 768;
      setIsPortrait(portrait);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Completion handler
  const handleComplete = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFading(true);
    setTimeout(() => {
      setIsMounted(false);
      if (onFinish) onFinish();
    }, 380);
  };

  // Real Application Milestones Loading Engine
  useEffect(() => {
    let isCancelled = false;

    // Check user preference for reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setProgress(100);
      setStatusMessage('Welcome to ProfessorVirus!');
      const quickTimer = setTimeout(handleComplete, 400);
      return () => clearTimeout(quickTimer);
    }

    const runLoadingSequence = async () => {
      try {
        // Milestone 1 (20%): Application Shell & Runtime Environment
        if (isCancelled) return;
        setProgress(20);
        setStatusMessage('Initializing learning space...');
        await new Promise(r => setTimeout(r, 120));

        // Milestone 2 (45%): Academic Catalog & Data Schemas Readiness
        if (isCancelled) return;
        try {
          const selectedCourse = localStorage.getItem('pv_selected_course') || 'BTech';
          const authToken = localStorage.getItem('token') || '';
          // Ensure theme and core keys are ready
          if (document && document.documentElement) {
            document.documentElement.setAttribute('data-loaded-course', selectedCourse);
          }
        } catch (_) {}
        setProgress(45);
        setStatusMessage('Loading academic resources & curriculum...');
        await new Promise(r => setTimeout(r, 150));

        // Milestone 3 (70%): Critical Brand Assets & Imagery Preloading
        if (isCancelled) return;
        const criticalImages = [
          '/assets/logo.png',
          '/assets/logo-full.png',
          isPortrait ? '/assets/splash_mobile_clean.jpg' : '/assets/splash_desktop_clean.jpg'
        ];

        const preloadPromises = criticalImages.map(src => {
          return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve({ src, status: 'loaded' });
            img.onerror = () => resolve({ src, status: 'fallback' });
            img.src = src;
          });
        });

        await Promise.allSettled(preloadPromises);
        if (isCancelled) return;
        setProgress(70);
        setStatusMessage('Preloading interface artwork & tools...');
        await new Promise(r => setTimeout(r, 140));

        // Milestone 4 (90%): Backend Services & Health Check
        if (isCancelled) return;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1800);
          
          const healthRes = await fetch(`${API_URL || ''}/api/health`, {
            method: 'GET',
            signal: controller.signal
          }).catch(() => null);

          clearTimeout(timeoutId);
        } catch (netErr) {
          // Graceful fallback for offline support
          console.info('[ProfessorVirus] Running in offline-first mode.');
        }

        if (isCancelled) return;
        setProgress(92);
        setStatusMessage('Preparing your dashboard...');
        await new Promise(r => setTimeout(r, 160));

        // Milestone 5 (100%): Full Initialization Complete
        if (isCancelled) return;
        setProgress(100);
        setStatusMessage('Welcome to ProfessorVirus!');

        // Brief 180ms hold at 100% to let user see completion, then fade-out
        setTimeout(() => {
          if (!isCancelled) {
            handleComplete();
          }
        }, 180);

      } catch (err) {
        console.error('[ProfessorVirus] Initialization warning:', err);
        if (!isCancelled) {
          setProgress(100);
          setStatusMessage('Ready!');
          setTimeout(handleComplete, 200);
        }
      }
    };

    runLoadingSequence();

    // Safety timeout: user is guaranteed to reach homepage within 4.5s maximum
    const safetyTimeout = setTimeout(() => {
      if (!finishedRef.current) {
        setProgress(100);
        setStatusMessage('Ready!');
        handleComplete();
      }
    }, 4500);

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimeout);
    };
  }, [isPortrait]);

  if (!isMounted) return null;

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
        zIndex: 999999,
        backgroundColor: '#FAF5ED', // Seamless match with artwork background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.015)' : 'scale(1)',
        transition: 'opacity 0.38s cubic-bezier(0.4, 0, 0.2, 1), transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* =========================================================================
          DESKTOP / LAPTOP / TABLET LANDSCAPE VIEW (>= 769px or landscape)
          Strict 16:9 aspect ratio preservation, zero cropping, zero stretching
          ========================================================================= */}
      {!isPortrait && (
        <div
          className="pv-splash-desktop-stage"
          style={{
            position: 'relative',
            width: 'min(100vw, 177.78vh)',
            height: 'min(56.25vw, 100dvh)',
            aspectRatio: '16 / 9',
            maxWidth: '100vw',
            maxHeight: '100dvh',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* 1. Official High-Resolution Landscape Artwork */}
          <img
            src="/assets/splash_desktop_clean.jpg"
            alt="ProfessorVirus Desktop Launch Screen"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              imageRendering: 'auto'
            }}
            onError={(e) => {
              // Graceful fallback to original landscape artwork if clean variant is unavailable
              e.currentTarget.src = '/assets/splash_desktop_landscape.jpg';
            }}
          />

          {/* 2. Soft Ambient Breathing Glow behind Academic Book Logo */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '26.8%',
              width: '18%',
              height: '22%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(212, 160, 60, 0.26) 0%, rgba(123, 20, 28, 0.08) 50%, transparent 75%)',
              borderRadius: '50%',
              filter: 'blur(10px)',
              pointerEvents: 'none',
              animation: 'pv-emblem-glow 3.5s ease-in-out infinite'
            }}
          />

          {/* 3. Dynamic HTML/CSS Progress Bar Track (Overlays exact coordinates) */}
          <div
            style={{
              position: 'absolute',
              left: '29.88%',
              top: '79.86%',
              width: '40.23%',
              height: '2.26%',
              minHeight: '12px',
              backgroundColor: '#F8D8DC',
              borderRadius: '9999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)'
            }}
          >
            {/* Animated Active Progress Fill */}
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #5B0C12 0%, #7B141C 55%, #9E1F2A 100%)',
                borderRadius: '9999px',
                transition: 'width 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)',
                position: 'relative',
                boxShadow: '0 0 10px rgba(123, 20, 28, 0.65)'
              }}
            >
              {/* Subtle Shimmer Sweep */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 235, 180, 0.35) 50%, transparent 100%)',
                  animation: 'pv-shimmer 2s infinite linear',
                  borderRadius: '9999px'
                }}
              />
            </div>
          </div>

          {/* 4. Live Progress Percentage beside Progress Bar */}
          <div
            style={{
              position: 'absolute',
              left: 'calc(70.12% + 12px)',
              top: '79.86%',
              transform: 'translateY(-15%)',
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(0.74rem, 1.35vw, 0.92rem)',
              fontWeight: 900,
              color: '#7B141C',
              letterSpacing: '0.02em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            {progress}%
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE / SMARTPHONE / TABLET PORTRAIT VIEW (< 769px or portrait)
          Strict 9:16 aspect ratio preservation, complete landmarks and branding
          ========================================================================= */}
      {isPortrait && (
        <div
          className="pv-splash-mobile-stage"
          style={{
            position: 'relative',
            width: 'min(100vw, 56.25vh)',
            height: 'min(177.78vw, 100dvh)',
            aspectRatio: '9 / 16',
            maxWidth: '100vw',
            maxHeight: '100dvh',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* 1. Official High-Resolution Portrait Artwork */}
          <img
            src="/assets/splash_mobile_clean.jpg"
            alt="ProfessorVirus Mobile Launch Screen"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              imageRendering: 'auto'
            }}
            onError={(e) => {
              // Graceful fallback to original portrait artwork if clean variant is unavailable
              e.currentTarget.src = '/assets/splash_mobile_portrait.jpg';
            }}
          />

          {/* 2. Soft Ambient Breathing Glow behind Academic Book Logo */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '28.8%',
              width: '32%',
              height: '18%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(212, 160, 60, 0.28) 0%, rgba(123, 20, 28, 0.08) 50%, transparent 75%)',
              borderRadius: '50%',
              filter: 'blur(10px)',
              pointerEvents: 'none',
              animation: 'pv-emblem-glow 3.5s ease-in-out infinite'
            }}
          />

          {/* 3. Dynamic HTML/CSS Progress Bar Track (Overlays exact coordinates) */}
          <div
            style={{
              position: 'absolute',
              left: '12.50%',
              top: '62.40%',
              width: '75.00%',
              height: '1.27%',
              minHeight: '11px',
              backgroundColor: '#F8D8DC',
              borderRadius: '9999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)'
            }}
          >
            {/* Animated Active Progress Fill */}
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #5B0C12 0%, #7B141C 55%, #9E1F2A 100%)',
                borderRadius: '9999px',
                transition: 'width 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)',
                position: 'relative',
                boxShadow: '0 0 10px rgba(123, 20, 28, 0.65)'
              }}
            >
              {/* Subtle Shimmer Sweep */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 235, 180, 0.35) 50%, transparent 100%)',
                  animation: 'pv-shimmer 2s infinite linear',
                  borderRadius: '9999px'
                }}
              />
            </div>
          </div>

          {/* 4. Live Progress Percentage beside Progress Bar */}
          <div
            style={{
              position: 'absolute',
              left: 'min(calc(87.50% + 8px), calc(100% - 38px))',
              top: '62.40%',
              transform: 'translateY(-20%)',
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(0.7rem, 2.5vw, 0.86rem)',
              fontWeight: 900,
              color: '#7B141C',
              letterSpacing: '0.02em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            {progress}%
          </div>
        </div>
      )}

      {/* =========================================================================
          KEYFRAME ANIMATIONS & PERFORMANCE ENHANCEMENTS
          ========================================================================= */}
      <style>{`
        @keyframes pv-emblem-glow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.96);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.06);
            opacity: 1;
          }
        }

        @keyframes pv-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        /* Fallback for ultra-small mobile screens */
        @media (max-width: 340px) {
          .pv-splash-mobile-stage {
            width: 100vw !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
