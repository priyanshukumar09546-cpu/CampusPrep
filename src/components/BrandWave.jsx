import React from 'react';

/**
 * BrandTopWave - Vector SVG top decorative wave for Professor Virus mobile screens
 * Recreated with pure CSS/SVG vectors to match reference designs identically.
 * Spans full width of the mobile viewport with layered burgundy curves and metallic gold ribbon.
 */
export function BrandTopWave({ className = '', style = {} }) {
  return (
    <div
      className={`pv-brand-top-wave ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '110px',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        ...style
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 430 110"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="pvAuthTopBurgundy" x1="0%" y1="0%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#4A080D" />
            <stop offset="35%" stopColor="#6C1219" />
            <stop offset="75%" stopColor="#861820" />
            <stop offset="100%" stopColor="#9E222B" />
          </linearGradient>
          <linearGradient id="pvAuthTopGold" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#B88022" />
            <stop offset="28%" stopColor="#FCEAB8" />
            <stop offset="60%" stopColor="#E2B44C" />
            <stop offset="85%" stopColor="#FCEAB8" />
            <stop offset="100%" stopColor="#B88022" />
          </linearGradient>
          <linearGradient id="pvAuthTopGoldSoft" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFF0D0" />
            <stop offset="50%" stopColor="#F8E3B6" />
            <stop offset="100%" stopColor="#D4A045" />
          </linearGradient>
        </defs>

        {/* Soft ivory accent back wave */}
        <path d="M 0,0 L 0,82 Q 110,95 240,55 T 430,15 L 430,0 Z" fill="#F8EEDC" opacity="0.65" />

        {/* Main rich burgundy corner shape */}
        <path d="M 0,0 L 0,68 Q 100,82 225,44 T 430,8 L 430,0 Z" fill="url(#pvAuthTopBurgundy)" />

        {/* Flowing metallic gold ribbon border */}
        <path
          d="M 0,68 Q 100,82 225,44 T 430,8"
          fill="none"
          stroke="url(#pvAuthTopGold)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* Secondary delicate champagne highlight */}
        <path
          d="M 0,74 Q 105,88 232,49 T 430,13"
          fill="none"
          stroke="url(#pvAuthTopGoldSoft)"
          strokeWidth="1.8"
          opacity="0.85"
        />

        {/* Star sparkles on top wave */}
        <polygon points="105,42 106.5,46 111,47.5 106.5,49 105,53 103.5,49 99,47.5 103.5,46" fill="#FFF5D6" />
        <circle cx="105" cy="47.5" r="1.1" fill="#FFFFFF" />

        <polygon points="215,30 216.5,33 220,34 216.5,35 215,38 213.5,35 210,34 213.5,33" fill="#FFF5D6" opacity="0.95" />
        <circle cx="215" cy="34" r="0.9" fill="#FFFFFF" />

        <polygon points="330,16 331,18.5 334,19.5 331,20.5 330,23 329,20.5 326,19.5 329,18.5" fill="#FFF5D6" opacity="0.9" />
        <circle cx="330" cy="19.5" r="0.8" fill="#FFFFFF" />

        <polygon points="45,36 46,38.5 49,39.5 46,40.5 45,43 44,40.5 41,39.5 44,38.5" fill="#FFF5D6" opacity="0.85" />
        <circle cx="45" cy="39.5" r="0.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

/**
 * BrandBottomWave - Vector SVG bottom flowing wave for Professor Virus mobile screens
 * Recreated with pure CSS/SVG vectors to match reference designs identically.
 * Grounds both screens with deep burgundy curves and glowing metallic ribbon border.
 */
export function BrandBottomWave({ className = '', style = {} }) {
  return (
    <div
      className={`pv-brand-bottom-wave ${className}`}
      style={{
        width: '100%',
        height: '135px',
        pointerEvents: 'none',
        position: 'relative',
        marginTop: '-12px',
        overflow: 'hidden',
        ...style
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 430 135"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="pvAuthBotBurgundy1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B141B" />
            <stop offset="60%" stopColor="#550B10" />
            <stop offset="100%" stopColor="#3A0508" />
          </linearGradient>
          <linearGradient id="pvAuthBotBurgundy2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#931C24" />
            <stop offset="45%" stopColor="#6F1218" />
            <stop offset="80%" stopColor="#4B080D" />
            <stop offset="100%" stopColor="#330407" />
          </linearGradient>
          <linearGradient id="pvAuthBotGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B88022" />
            <stop offset="25%" stopColor="#FCEAB8" />
            <stop offset="55%" stopColor="#E2B44C" />
            <stop offset="85%" stopColor="#FCEAB8" />
            <stop offset="100%" stopColor="#B88022" />
          </linearGradient>
          <linearGradient id="pvAuthBotGoldSoft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EBD09C" />
            <stop offset="50%" stopColor="#FFF0D0" />
            <stop offset="100%" stopColor="#D9A952" />
          </linearGradient>
          <radialGradient id="pvAuthBotGlow" cx="72%" cy="60%" r="45%">
            <stop offset="0%" stopColor="#D6A13D" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#861820" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft ivory accent back wave */}
        <path d="M 0,85 Q 110,38 230,64 T 430,22 L 430,135 L 0,135 Z" fill="#F8EEDC" opacity="0.65" />

        {/* Deep background burgundy wave */}
        <path d="M 0,65 Q 120,24 250,50 T 430,12 L 430,135 L 0,135 Z" fill="url(#pvAuthBotBurgundy1)" />

        {/* Back wave gold trim */}
        <path d="M 0,65 Q 120,24 250,50 T 430,12" fill="none" stroke="url(#pvAuthBotGoldSoft)" strokeWidth="1.8" opacity="0.8" />

        {/* Foreground sweeping burgundy wave */}
        <path d="M 0,92 Q 135,36 280,72 T 430,30 L 430,135 L 0,135 Z" fill="url(#pvAuthBotBurgundy2)" />

        {/* Subtle warm golden ambient glow inside dark burgundy base */}
        <rect x="0" y="30" width="430" height="105" fill="url(#pvAuthBotGlow)" pointerEvents="none" />

        {/* Foreground primary metallic gold ribbon border */}
        <path
          d="M 0,92 Q 135,36 280,72 T 430,30"
          fill="none"
          stroke="url(#pvAuthBotGold)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* Star sparkles on bottom wave */}
        <polygon points="345,42 347,47 352,48.5 347,50 345,55 343,50 338,48.5 343,47" fill="#FFF5D6" />
        <circle cx="345" cy="48.5" r="1.3" fill="#FFFFFF" />

        <polygon points="145,52 146.5,56 151,57.2 146.5,58.5 145,62 143.5,58.5 139,57.2 143.5,56" fill="#FFF5D6" opacity="0.9" />
        <circle cx="145" cy="57.2" r="1.0" fill="#FFFFFF" />

        <polygon points="45,78 46,81 49,82 46,83 45,86 44,83 41,82 44,81" fill="#FFF5D6" opacity="0.8" />
        <circle cx="45" cy="82" r="0.9" fill="#FFFFFF" />

        <polygon points="395,62 396,64.5 399,65.5 396,66.5 395,69 394,66.5 391,65.5 394,64.5" fill="#FFF5D6" opacity="0.85" />
        <circle cx="395" cy="65.5" r="0.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export default { BrandTopWave, BrandBottomWave };
