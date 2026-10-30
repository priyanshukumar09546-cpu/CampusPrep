import React from 'react';

/**
 * AnimatedArrow — Elegant curved burgundy & gold arrow pointing down to the 3D gift
 * Matches Reference Image 1 exactly.
 */
export default function AnimatedArrow({ className = '' }) {
  return (
    <div
      className={`pv-animated-arrow-wrapper ${className}`}
      style={{
        width: '64px',
        height: '68px',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <svg
        width="64"
        height="68"
        viewBox="0 0 74 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 4px 10px rgba(120, 20, 22, 0.4))'
        }}
      >
        <defs>
          {/* Arrow Gradient: Burgundy to Deep Maroon with Golden Shimmer */}
          <linearGradient id="arrowBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="50%" stopColor="#781416" />
            <stop offset="100%" stopColor="#5B0F11" />
          </linearGradient>

          {/* Golden Trim Gradient */}
          <linearGradient id="arrowBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Graceful Curved Arrow Path (Sweeping from top-left downward to bottom-center) */}
        <path
          d="M 12 8 C 22 14, 38 22, 46 36 C 52 46, 52 56, 48 62"
          stroke="url(#arrowBodyGrad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Highlight on Arrow Curve */}
        <path
          d="M 14 9 C 23 15, 38 23, 45 36 C 48 43, 49 50, 48 56"
          stroke="rgba(254, 240, 138, 0.6)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Crisp Triangular Arrow Head Pointing Downward */}
        <path
          d="M 48 76 L 36 57 C 42 60, 52 60, 58 57 Z"
          fill="url(#arrowBodyGrad)"
          stroke="url(#arrowBorderGrad)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Specular Glint on Arrow Tip */}
        <circle cx="48" cy="71" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </svg>

      <style>{`
        @keyframes pvArrowBounce {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(6px) rotate(2deg);
          }
        }

        .pv-animated-arrow-wrapper {
          animation: pvArrowBounce 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
