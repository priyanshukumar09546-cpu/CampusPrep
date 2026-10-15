import React, { useState, useEffect } from 'react';

/**
 * MobileSplashScreen — Official Native-Style In-App Launch Screen
 * 
 * Requirements:
 * - Uses the full original Professor Virus 3D artwork (/assets/mobile_splash_artwork.png).
 * - Full-screen presentation on mobile devices (< 1024px).
 * - Desktop (>= 1024px) completely bypasses this screen with zero delay.
 * - Perfectly centers the artwork preserving its original aspect ratio (object-fit: contain).
 * - Respects safe areas (notches, status bars, home indicators).
 * - Displays on initial mobile launch / reload, dismisses smoothly with 350ms fade transition.
 * - Graceful timeout/error handling so user is never trapped.
 */
export default function MobileSplashScreen({ onFinish }) {
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // 1. Desktop devices (>= 1024px) bypass immediately with zero delay
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (onFinish) onFinish();
      setIsMounted(false);
      return;
    }

    // 2. Short, sensible display duration (~1.4s) to establish brand identity without delaying user
    const timer = setTimeout(() => {
      setIsFading(true);
      // 3. Smooth fade-out before unmounting component
      const unmountTimer = setTimeout(() => {
        setIsMounted(false);
        if (onFinish) onFinish();
      }, 350);
      return () => clearTimeout(unmountTimer);
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {/* Centered Splash Container Preserving Exact Proportions */}
      <div
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '520px',
          maxHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <img
          src="/assets/mobile_splash_artwork.png"
          alt="Professor Virus — Study Smart. Prepare Better."
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100dvh',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            animation: 'pvSplashFadeIn 0.4s ease-out forwards'
          }}
          onError={() => {
            // Failsafe: if image cannot be loaded, dismiss immediately so user is never trapped
            setIsMounted(false);
            if (onFinish) onFinish();
          }}
        />
      </div>

      {/* Subtle fade-in animation for smooth first frame */}
      <style>{`
        @keyframes pvSplashFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
