import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * ProfessorVirus Deep Space Cinematic Animated Starfield (MentorNearby Style)
 * 
 * Features:
 * - Natural star distribution across deep pure-black space (#030303)
 * - Hundreds of tiny stars twinkling and blinking at varying speeds
 * - Multi-depth layering:
 *     * Far: tiny, dense, gentle breathing silver stars
 *     * Mid: crisp white and pale gold stars with gentle float
 *     * Near: larger golden glimmers with soft radial aura & flare
 * - Soft ambient cosmic nebulae in warm gold and amber
 * - Occasional graceful shooting star streak across the sky
 * - Active ONLY in Dark Mode; instantly hidden with 0% CPU in Light Mode
 * - Respects prefers-reduced-motion, pauses on tab blur
 * - Non-blocking (pointer-events: none)
 */
export default function StarfieldBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    // If in Light Mode, do not start canvas loop
    if (!isDark) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    let shootingStars = [];
    let width = 0;
    let height = 0;
    let lastTime = performance.now();
    let nextShootingStarTime = performance.now() + 3000 + Math.random() * 5000;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Celestial palettes
    const GOLD_PALETTE = ['#FFB800', '#FFD066', '#FFA000', '#FFE699', '#F59E0B'];
    const WHITE_PALETTE = ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#BAE6FD'];

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Star count based on screen size (~90 on mobile, ~260 on desktop)
      const count = Math.min(280, Math.max(80, Math.floor((width * height) / 6000)));
      stars = [];

      for (let i = 0; i < count; i++) {
        const depth = Math.random(); // 0 = distant background, 1 = close foreground
        const isGold = Math.random() < 0.24; // ~24% have warm electric gold starlight
        const color = isGold 
          ? GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)]
          : WHITE_PALETTE[Math.floor(Math.random() * WHITE_PALETTE.length)];

        // Sizes: far tiny (<0.9px), mid (0.9-1.4px), near (1.5-2.2px)
        let size;
        if (depth < 0.6) {
          size = 0.45 + Math.random() * 0.45;
        } else if (depth < 0.88) {
          size = 0.9 + Math.random() * 0.5;
        } else {
          size = 1.4 + Math.random() * 0.8;
        }

        // Varied twinkle periods: from fast shimmer to slow breathing
        const twinkleSpeed = 0.0012 + Math.random() * 0.0035;
        const baseAlpha = depth < 0.5 ? 0.2 + Math.random() * 0.3 : 0.45 + Math.random() * 0.45;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseAlpha,
          twinkleSpeed,
          twinklePhase: Math.random() * Math.PI * 2,
          isGold,
          color,
          depth,
          driftSpeed: (0.015 + depth * 0.035) // subtle celestial upward drift
        });
      }
    };

    const spawnShootingStar = (time) => {
      const startX = Math.random() * (width * 0.75);
      const startY = Math.random() * (height * 0.4);
      const length = 70 + Math.random() * 90;
      const speed = 7 + Math.random() * 5;
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees diagonal

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length,
        alpha: 1,
        life: 0,
        maxLife: 35 + Math.random() * 20,
        color: Math.random() < 0.4 ? '#FFB800' : '#FFFFFF'
      });

      nextShootingStarTime = time + 6000 + Math.random() * 8000;
    };

    const draw = (currentTime) => {
      const dt = Math.min(currentTime - lastTime, 64);
      lastTime = currentTime;

      // 1. Deep Pure-Black Background (#030303)
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Deep Space Nebulae (Soft gold & amber stardust dust clouds)
      const nebula1 = ctx.createRadialGradient(width * 0.18, height * 0.28, 20, width * 0.18, height * 0.28, width * 0.48);
      nebula1.addColorStop(0, 'rgba(255, 184, 0, 0.024)');
      nebula1.addColorStop(0.6, 'rgba(255, 140, 0, 0.009)');
      nebula1.addColorStop(1, 'rgba(3, 3, 3, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(width * 0.82, height * 0.72, 20, width * 0.82, height * 0.72, width * 0.42);
      nebula2.addColorStop(0, 'rgba(214, 161, 61, 0.020)');
      nebula2.addColorStop(0.7, 'rgba(255, 184, 0, 0.006)');
      nebula2.addColorStop(1, 'rgba(3, 3, 3, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!prefersReducedMotion) {
          s.twinklePhase += s.twinkleSpeed * dt;
          s.y -= s.driftSpeed * (dt / 16.6);
          if (s.y < -10) s.y = height + 10;
        }

        // Smooth sine wave twinkle (0 to 1)
        const pulse = (Math.sin(s.twinklePhase) + 1) * 0.5;
        const alpha = Math.min(1, Math.max(0.12, s.baseAlpha * (0.45 + pulse * 0.75)));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;

        // Radiant glow aura on close foreground golden stars (MentorNearby signature)
        if (s.isGold && s.depth > 0.65) {
          ctx.shadowBlur = s.size * 4;
          ctx.shadowColor = 'rgba(255, 184, 0, 0.75)';
        } else if (s.depth > 0.85) {
          ctx.shadowBlur = s.size * 2.8;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra cross-flare sparkle on the brightest ~8% of near golden stars
        if (s.isGold && s.depth > 0.88 && pulse > 0.8) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.6;
          const flareLen = s.size * 2.2 * pulse;
          ctx.beginPath();
          ctx.moveTo(s.x - flareLen, s.y);
          ctx.lineTo(s.x + flareLen, s.y);
          ctx.moveTo(s.x, s.y - flareLen);
          ctx.lineTo(s.x, s.y + flareLen);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 4. Subtle Occasional Shooting Stars (Cosmic Living Atmosphere)
      if (!prefersReducedMotion) {
        if (currentTime > nextShootingStarTime) {
          spawnShootingStar(currentTime);
        }

        for (let j = shootingStars.length - 1; j >= 0; j--) {
          const ss = shootingStars[j];
          ss.x += ss.dx;
          ss.y += ss.dy;
          ss.life += 1;
          const progress = ss.life / ss.maxLife;
          ss.alpha = Math.max(0, 1 - progress);

          const tailX = ss.x - (ss.dx / Math.hypot(ss.dx, ss.dy)) * ss.length;
          const tailY = ss.y - (ss.dy / Math.hypot(ss.dx, ss.dy)) * ss.length;

          ctx.save();
          const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
          grad.addColorStop(0, 'rgba(255, 184, 0, 0)');
          grad.addColorStop(0.7, `rgba(255, 208, 102, ${ss.alpha * 0.6})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 6;
          ctx.shadowColor = ss.color === '#FFB800' ? 'rgba(255, 184, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(ss.x, ss.y);
          ctx.stroke();
          ctx.restore();

          if (ss.life >= ss.maxLife) {
            shootingStars.splice(j, 1);
          }
        }
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
  }, [isDark]);

  if (!isDark) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        backgroundColor: '#030303'
      }}
    />
  );
}
