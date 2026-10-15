import React from 'react';

/**
 * BrandTopWave - Vector SVG top-left decorative wave for Professor Virus mobile screens
 * Recreated with pure CSS/SVG vectors to match reference designs identically.
 */
export function BrandTopWave({ className = '', style = {} }) {
  return (
    <div
      className={`pv-brand-top-wave ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '65%',
        maxWidth: '300px',
        height: '75px',
        pointerEvents: 'none',
        zIndex: 1,
        ...style
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 75"
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
        <path d="M 0,0 L 0,72 Q 80,52 155,28 T 300,0 Z" fill="#F8EEDC" opacity="0.65" />

        {/* Main rich burgundy corner shape */}
        <path d="M 0,0 L 0,60 Q 75,44 145,22 T 275,0 Z" fill="url(#pvAuthTopBurgundy)" />

        {/* Flowing metallic gold ribbon border */}
        <path
          d="M 0,60 Q 75,44 145,22 T 275,0"
          fill="none"
          stroke="url(#pvAuthTopGold)"
          strokeWidth="3.6"
          strokeLinecap="round"
        />

        {/* Secondary delicate champagne highlight */}
        <path
          d="M 0,66 Q 78,48 150,25 T 288,0"
          fill="none"
          stroke="url(#pvAuthTopGoldSoft)"
          strokeWidth="1.8"
          opacity="0.85"
        />

        {/* Star sparkles on top wave */}
        <polygon points="105,28 106.5,32 111,33.5 106.5,35 105,39 103.5,35 99,33.5 103.5,32" fill="#FFF5D6" />
        <circle cx="105" cy="33.5" r="1.1" fill="#FFFFFF" />

        <polygon points="190,12 191,15 194,16 191,17 190,20 189,17 186,16 189,15" fill="#FFF5D6" opacity="0.9" />
        <circle cx="190" cy="16" r="0.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

/**
 * BrandBottomWave - Vector SVG bottom flowing wave for Professor Virus mobile screens
 * Recreated with pure CSS/SVG vectors to match reference designs identically.
 */
export function BrandBottomWave({ className = '', style = {} }) {
  return (
    <div
      className={`pv-brand-bottom-wave ${className}`}
      style={{
        width: '100%',
        height: '115px',
        pointerEvents: 'none',
        position: 'relative',
        marginTop: '-12px',
        overflow: 'hidden',
        ...style
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 473 130"
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
          <radialGradient id="pvAuthBotGlow" cx="75%" cy="65%" r="45%">
            <stop offset="0%" stopColor="#D6A13D" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#861820" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft ivory accent back wave */}
        <path d="M 0,72 Q 110,28 225,52 T 473,16 L 473,130 L 0,130 Z" fill="#F8EEDC" opacity="0.65" />

        {/* Deep background burgundy wave */}
        <path d="M 0,56 Q 120,16 245,38 T 473,8 L 473,130 L 0,130 Z" fill="url(#pvAuthBotBurgundy1)" />

        {/* Back wave gold trim */}
        <path d="M 0,56 Q 120,16 245,38 T 473,8" fill="none" stroke="url(#pvAuthBotGoldSoft)" strokeWidth="1.8" opacity="0.8" />

        {/* Foreground sweeping burgundy wave */}
        <path d="M 0,78 Q 140,28 280,58 T 473,26 L 473,130 L 0,130 Z" fill="url(#pvAuthBotBurgundy2)" />

        {/* Subtle warm golden ambient glow inside dark burgundy base */}
        <rect x="0" y="30" width="473" height="100" fill="url(#pvAuthBotGlow)" pointerEvents="none" />

        {/* Foreground primary metallic gold ribbon border */}
        <path
          d="M 0,78 Q 140,28 280,58 T 473,26"
          fill="none"
          stroke="url(#pvAuthBotGold)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* Star sparkles on bottom wave */}
        <polygon points="380,36 382,41 387,42.5 382,44 380,49 378,44 373,42.5 378,41" fill="#FFF5D6" />
        <circle cx="380" cy="42.5" r="1.4" fill="#FFFFFF" />

        <polygon points="160,42 161.5,46 166,47.2 161.5,48.5 160,52 158.5,48.5 154,47.2 158.5,46" fill="#FFF5D6" opacity="0.9" />
        <circle cx="160" cy="47.2" r="1.1" fill="#FFFFFF" />

        <polygon points="50,68 51,71 54,72 51,73 50,76 49,73 46,72 49,71" fill="#FFF5D6" opacity="0.8" />
        <circle cx="50" cy="72" r="0.9" fill="#FFFFFF" />

        <polygon points="435,52 436,54 438,55 436,56 435,58 434,56 432,55 434,54" fill="#FFF5D6" opacity="0.85" />
      </svg>
    </div>
  );
}

export default { BrandTopWave, BrandBottomWave };
