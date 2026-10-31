import React, { useEffect, useRef } from 'react';

/**
 * ProfessorVirus Deep Space Cinematic Animated Starfield
 * - Natural star distribution across pure ZED BLACK (#030303)
 * - Multi-depth parallax twinkling layers (distant silver, mid white, foreground electric gold)
 * - Soft stardust nebula glows
 * - High-performance Canvas with requestAnimationFrame & delta-time
 * - Mobile optimized, respects prefers-reduced-motion, pauses on tab blur
 * - Non-blocking (pointer-events: none)
 */
export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    let width = 0;
    let height = 0;
    let lastTime = performance.now();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Palette for celestial bodies
    const GOLD_PALETTE = ['#FFB800', '#FFD066', '#FFA000', '#FFE699'];
    const WHITE_PALETTE = ['#FFFFFF', '#E4E4E7', '#D4D4D8', '#A1A1AA'];

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Star count based on screen area: balanced density (~60 on mobile, ~160 on large desktop)
      const count = Math.min(180, Math.max(50, Math.floor((width * height) / 9000)));
      stars = [];

      for (let i = 0; i < count; i++) {
        const depth = Math.random(); // 0 = far, 1 = close
        const isGold = Math.random() < 0.22; // ~22% stars have warm electric gold tint
        const color = isGold 
          ? GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)]
          : WHITE_PALETTE[Math.floor(Math.random() * WHITE_PALETTE.length)];

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: depth < 0.5 ? Math.random() * 0.9 + 0.5 : Math.random() * 1.5 + 1.1,
          baseAlpha: depth < 0.4 ? 0.2 + Math.random() * 0.25 : 0.45 + Math.random() * 0.4,
          twinkleSpeed: 0.0015 + Math.random() * 0.003,
          twinklePhase: Math.random() * Math.PI * 2,
          isGold,
          color,
          depth,
          driftSpeed: (0.02 + depth * 0.04) // very subtle upwards cosmic drift
        });
      }
    };

    const draw = (currentTime) => {
      const dt = Math.min(currentTime - lastTime, 64);
      lastTime = currentTime;

      // Pure ZED BLACK background
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      // Subtle background ambient nebula dust (very faint warm gold and deep cosmic tint)
      const nebula1 = ctx.createRadialGradient(width * 0.2, height * 0.35, 10, width * 0.2, height * 0.35, width * 0.45);
      nebula1.addColorStop(0, 'rgba(255, 184, 0, 0.022)');
      nebula1.addColorStop(0.6, 'rgba(255, 140, 0, 0.008)');
      nebula1.addColorStop(1, 'rgba(3, 3, 3, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, width * 0.4);
      nebula2.addColorStop(0, 'rgba(200, 141, 45, 0.018)');
      nebula2.addColorStop(0.7, 'rgba(255, 184, 0, 0.005)');
      nebula2.addColorStop(1, 'rgba(3, 3, 3, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Draw each star
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!prefersReducedMotion) {
          s.twinklePhase += s.twinkleSpeed * dt;
          s.y -= s.driftSpeed * (dt / 16.6);
          if (s.y < -10) s.y = height + 10;
        }

        const pulse = (Math.sin(s.twinklePhase) + 1) * 0.5; // 0 to 1
        const alpha = Math.min(1, Math.max(0.1, s.baseAlpha * (0.6 + pulse * 0.6)));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;

        // Subtle glow on foreground gold stars
        if (s.isGold && s.depth > 0.6) {
          ctx.shadowBlur = s.size * 3.5;
          ctx.shadowColor = 'rgba(255, 184, 0, 0.55)';
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    initStars();
    if (prefersReducedMotion) {
      draw(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(draw);
    }

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initStars();
        if (prefersReducedMotion) draw(performance.now());
      }, 150);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        userSelect: 'none',
        backgroundColor: '#030303'
      }}
    />
  );
}
