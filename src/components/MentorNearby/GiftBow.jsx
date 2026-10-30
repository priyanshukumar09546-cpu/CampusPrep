import React from 'react';

/**
 * GiftBow — Solid, Radiant 3D Metallic Golden Ribbon Bow
 * Faithful match to Reference Image 1:
 * - Voluminous, plump, solid golden loops with bright specular glints
 * - No dark hollow holes; rich yellow and metallic amber gradients
 * - Prominent 3D center knot with specular highlight
 * - Draped golden ribbon tails cascading over the lid
 */
export default function GiftBow({ size = 114, className = '' }) {
  return (
    <svg
      width={size}
      height={size * 0.64}
      viewBox="0 0 140 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        filter: 'drop-shadow(0 6px 12px rgba(120, 20, 22, 0.35)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.55))',
        display: 'block'
      }}
    >
      <defs>
        {/* Main Radiant Gold Ribbon Gradient */}
        <linearGradient id="pvGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="18%" stopColor="#FDE047" />
          <stop offset="48%" stopColor="#F59E0B" />
          <stop offset="78%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Specular White-Gold Crest Sheen */}
        <linearGradient id="pvGoldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </linearGradient>

        {/* Deep Gold Shading for Loop Undersides */}
        <linearGradient id="pvGoldDeep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="60%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>

      {/* =======================================================================
          1. DRAPED RIBBON TAILS
          ======================================================================= */}
      {/* Left Tail */}
      <path
        d="M 64 54 C 54 62, 34 72, 18 84 C 26 86, 38 82, 48 76 C 58 70, 66 60, 68 54 Z"
        fill="url(#pvGoldDeep)"
      />
      <path
        d="M 62 52 C 52 60, 36 70, 22 82 C 28 83, 38 80, 48 74 C 58 68, 64 58, 66 52 Z"
        fill="url(#pvGoldMain)"
      />
      <path
        d="M 60 53 C 52 61, 38 69, 28 78"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Right Tail */}
      <path
        d="M 76 54 C 86 62, 106 72, 122 84 C 114 86, 102 82, 92 76 C 82 70, 74 60, 72 54 Z"
        fill="url(#pvGoldDeep)"
      />
      <path
        d="M 78 52 C 88 60, 104 70, 118 82 C 112 83, 102 80, 92 74 C 82 68, 76 58, 74 52 Z"
        fill="url(#pvGoldMain)"
      />
      <path
        d="M 80 53 C 88 61, 102 69, 112 78"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* =======================================================================
          2. BACK LOOPS (Plump 3D Depth)
          ======================================================================= */}
      {/* Left Back Loop */}
      <path
        d="M 68 46 C 48 18, 16 14, 10 28 C 4 40, 16 56, 44 54 C 56 53, 66 48, 68 46 Z"
        fill="url(#pvGoldDeep)"
      />
      <path
        d="M 66 45 C 50 20, 22 16, 14 30 C 10 40, 20 52, 44 51 C 56 50, 64 47, 66 45 Z"
        fill="url(#pvGoldMain)"
        opacity="0.9"
      />

      {/* Right Back Loop */}
      <path
        d="M 72 46 C 92 18, 124 14, 130 28 C 136 40, 124 56, 96 54 C 84 53, 74 48, 72 46 Z"
        fill="url(#pvGoldDeep)"
      />
      <path
        d="M 74 45 C 90 20, 118 16, 126 30 C 130 40, 120 52, 96 51 C 84 50, 76 47, 74 45 Z"
        fill="url(#pvGoldMain)"
        opacity="0.9"
      />

      {/* =======================================================================
          3. FRONT VOLUMINOUS LOOPS (Solid Radiant Gold with Specular Crests)
          ======================================================================= */}
      {/* Left Front Loop */}
      <path
        d="M 68 50 C 44 20, 14 18, 6 34 C -2 50, 16 66, 46 62 C 58 60, 66 54, 68 50 Z"
        fill="url(#pvGoldMain)"
        stroke="#D97706"
        strokeWidth="0.75"
      />
      {/* Left Loop Top Sheen Highlight */}
      <path
        d="M 64 45 C 44 22, 18 20, 10 34 C 8 38, 12 40, 22 36 C 34 30, 52 38, 62 45 Z"
        fill="url(#pvGoldHighlight)"
      />
      {/* Left Loop Center Gold Fold Accent */}
      <path
        d="M 28 36 C 36 34, 48 38, 56 46"
        stroke="#FEF08A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Right Front Loop */}
      <path
        d="M 72 50 C 96 20, 126 18, 134 34 C 142 50, 124 66, 94 62 C 82 60, 74 54, 72 50 Z"
        fill="url(#pvGoldMain)"
        stroke="#D97706"
        strokeWidth="0.75"
      />
      {/* Right Loop Top Sheen Highlight */}
      <path
        d="M 76 45 C 96 22, 122 20, 130 34 C 132 38, 128 40, 118 36 C 106 30, 88 38, 78 45 Z"
        fill="url(#pvGoldHighlight)"
      />
      {/* Right Loop Center Gold Fold Accent */}
      <path
        d="M 112 36 C 104 34, 92 38, 84 46"
        stroke="#FEF08A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Subtle Shadow Crease between loops and knot */}
      <path
        d="M 58 50 C 62 48, 66 50, 68 52"
        stroke="#78350F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 82 50 C 78 48, 74 50, 72 52"
        stroke="#78350F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* =======================================================================
          4. CENTRAL TIED KNOT (Spherical 3D Golden Knot with Specular Glint)
          ======================================================================= */}
      {/* Knot Shadow Base */}
      <ellipse
        cx="70"
        cy="51"
        rx="15"
        ry="13"
        fill="url(#pvGoldDeep)"
      />
      {/* Knot Main Metallic Body */}
      <ellipse
        cx="70"
        cy="49.5"
        rx="13.5"
        ry="11.5"
        fill="url(#pvGoldMain)"
        stroke="#FDE047"
        strokeWidth="1.2"
      />
      {/* Knot Top Specular Highlight */}
      <ellipse
        cx="68"
        cy="47"
        rx="8"
        ry="5"
        fill="url(#pvGoldHighlight)"
      />
      {/* Specular White Glint Dot */}
      <circle
        cx="67"
        cy="46"
        r="2"
        fill="#FFFFFF"
        opacity="0.95"
      />
    </svg>
  );
}
