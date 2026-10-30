import React from 'react';
import GiftBow from './GiftBow';

/**
 * GiftBox3D — Premium Burgundy & Metallic Gold 3D Gift Box
 * Features:
 * - 3D Box with lid and rounded corners
 * - Golden cross-ribbons with metallic gradients
 * - Prominent glowing white question mark '?' on the front face
 * - Intricate golden ribbon bow with specular highlights
 * - Radial golden pedestal glow & floor shadow underneath
 * - Two mini tilted floating gift boxes for 3D depth
 * - Animated golden sparkles (✦, ✧)
 * - Smooth floating animation & interactive hover transform
 */
export default function GiftBox3D({ onClick, isHovered = false }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Open Gift — Tutor Registration Promotion"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick();
        }
      }}
      className="pv-gift-box-3d-wrapper"
      style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* =========================================================================
          1. RADIAL GOLDEN PEDESTAL GLOW & FLOOR SHADOW (Matches Reference 1)
          ========================================================================= */}
      {/* Outer Golden Ambient Glow */}
      <div
        className="pv-gift-ambient-glow"
        style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '190px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.65) 0%, rgba(217, 119, 6, 0.35) 45%, rgba(245, 158, 11, 0) 75%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Golden Glowing Pedestal Ring (Crisp Edge Ring) */}
      <div
        className="pv-gift-pedestal-ring"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%) rotateX(68deg)',
          width: '146px',
          height: '146px',
          borderRadius: '50%',
          border: '3px solid rgba(253, 230, 138, 0.85)',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.8), inset 0 0 16px rgba(245, 158, 11, 0.6)',
          background: 'radial-gradient(circle, rgba(254, 243, 199, 0.45) 0%, rgba(217, 119, 6, 0.15) 60%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* Soft Contact Floor Shadow */}
      <div
        className="pv-gift-floor-shadow"
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '24px',
          borderRadius: '50%',
          background: 'rgba(80, 10, 14, 0.45)',
          filter: 'blur(6px)',
          pointerEvents: 'none',
          zIndex: 3
        }}
      />

      {/* =========================================================================
          2. FLOATING SPARKLES (✦, ✧)
          ========================================================================= */}
      {/* Top Left Golden Star Sparkle */}
      <div
        className="pv-sparkle-star pv-sparkle-1"
        style={{
          position: 'absolute',
          top: '8px',
          left: '6px',
          color: '#FBBF24',
          fontSize: '18px',
          filter: 'drop-shadow(0 0 6px #FDE047)',
          zIndex: 20
        }}
      >
        ✦
      </div>

      {/* Top Right Golden Star Sparkle */}
      <div
        className="pv-sparkle-star pv-sparkle-2"
        style={{
          position: 'absolute',
          top: '2px',
          right: '10px',
          color: '#FDE047',
          fontSize: '14px',
          filter: 'drop-shadow(0 0 5px #F59E0B)',
          zIndex: 20
        }}
      >
        ✧
      </div>

      {/* Middle Right Golden Sparkle */}
      <div
        className="pv-sparkle-star pv-sparkle-3"
        style={{
          position: 'absolute',
          top: '68px',
          right: '-12px',
          color: '#F59E0B',
          fontSize: '16px',
          filter: 'drop-shadow(0 0 6px #FDE68A)',
          zIndex: 20
        }}
      >
        ✦
      </div>

      {/* Bottom Left Sparkle */}
      <div
        className="pv-sparkle-star pv-sparkle-4"
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '-16px',
          color: '#FEF08A',
          fontSize: '13px',
          filter: 'drop-shadow(0 0 5px #D97706)',
          zIndex: 20
        }}
      >
        ✧
      </div>

      {/* =========================================================================
          3. FLOATING MINI GIFT BOXES (Matches Reference 1)
          ========================================================================= */}
      {/* Mini Gift 1: Upper Left */}
      <div
        className="pv-mini-gift pv-mini-gift-top-left"
        style={{
          position: 'absolute',
          top: '18px',
          left: '-18px',
          width: '32px',
          height: '32px',
          zIndex: 15
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#781416',
          borderRadius: '6px',
          boxShadow: '0 6px 14px rgba(120, 20, 22, 0.45), 0 0 0 1px #F59E0B',
          transform: 'rotate(-18deg) scale(0.95)'
        }}>
          {/* Vertical gold ribbon */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '6px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to right, #F59E0B, #FEF3C7, #D97706)'
          }} />
          {/* Horizontal gold ribbon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '6px',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(to bottom, #F59E0B, #FEF3C7, #D97706)'
          }} />
          {/* Mini Bow */}
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '12px',
            height: '7px',
            background: '#FDE68A',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(180, 83, 9, 0.5)'
          }} />
        </div>
      </div>

      {/* Mini Gift 2: Lower Left */}
      <div
        className="pv-mini-gift pv-mini-gift-bottom-left"
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '-26px',
          width: '26px',
          height: '26px',
          zIndex: 15
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#881337',
          borderRadius: '5px',
          boxShadow: '0 5px 12px rgba(136, 19, 55, 0.4), 0 0 0 1px #FBBF24',
          transform: 'rotate(15deg) scale(0.9)'
        }}>
          {/* Vertical ribbon */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '5px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to right, #F59E0B, #FEF3C7, #D97706)'
          }} />
          {/* Horizontal ribbon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '5px',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(to bottom, #F59E0B, #FEF3C7, #D97706)'
          }} />
          {/* Mini Bow */}
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '10px',
            height: '6px',
            background: '#FDE68A',
            borderRadius: '3px'
          }} />
        </div>
      </div>

      {/* =========================================================================
          4. MAIN 3D GIFT BOX BODY & LID (Floating Container)
          ========================================================================= */}
      <div
        className="pv-gift-floating-body"
        style={{
          position: 'relative',
          width: '136px',
          height: '132px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 10,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* GOLDEN BOW ATOP THE LID */}
        <div
          style={{
            position: 'absolute',
            top: '-36px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 16,
            pointerEvents: 'none'
          }}
        >
          <GiftBow size={106} />
        </div>

        {/* BOX LID (Slightly wider with beveled gold trim) */}
        <div
          style={{
            position: 'relative',
            width: '134px',
            height: '28px',
            borderRadius: '9px 9px 5px 5px',
            background: 'linear-gradient(180deg, #991B1B 0%, #781416 60%, #5B0F11 100%)',
            border: '2px solid #D97706',
            borderBottom: '3px solid #78350F',
            boxShadow: '0 6px 14px rgba(0, 0, 0, 0.35), inset 0 2px 3px rgba(254, 240, 138, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.4)',
            zIndex: 14,
            overflow: 'hidden'
          }}
        >
          {/* Lid Horizontal Golden Ribbon */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '11px',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(180deg, #FEF3C7 0%, #F59E0B 45%, #D97706 70%, #92400E 100%)',
              borderTop: '0.8px solid #FFFBEB',
              borderBottom: '0.8px solid #78350F',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
            }}
          />

          {/* Lid Vertical Golden Ribbon Segment */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '18px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, #B45309 0%, #F59E0B 25%, #FEF3C7 50%, #F59E0B 75%, #92400E 100%)',
              borderLeft: '0.8px solid #78350F',
              borderRight: '0.8px solid #78350F',
              boxShadow: '0 0 6px rgba(0, 0, 0, 0.25)',
              zIndex: 2
            }}
          />

          {/* Specular Shimmer on Lid */}
          <div
            style={{
              position: 'absolute',
              top: '1px',
              left: '8px',
              right: '8px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent)',
              borderRadius: '2px',
              zIndex: 3
            }}
          />
        </div>

        {/* BOX MAIN CUBE BASE */}
        <div
          style={{
            position: 'relative',
            width: '124px',
            height: '88px',
            marginTop: '-2px',
            borderRadius: '0 0 12px 12px',
            background: 'linear-gradient(180deg, #781416 0%, #631012 40%, #4C0B0D 100%)',
            border: '2px solid #B45309',
            borderTop: 'none',
            boxShadow: '0 12px 28px rgba(90, 10, 14, 0.45), inset 0 0 16px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(254, 240, 138, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 12
          }}
        >
          {/* Vertical Golden Ribbon */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '18px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, #92400E 0%, #F59E0B 25%, #FEF3C7 50%, #F59E0B 75%, #78350F 100%)',
              borderLeft: '1px solid #78350F',
              borderRight: '1px solid #78350F',
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.35)',
              zIndex: 2
            }}
          />

          {/* Horizontal Golden Ribbon */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '14px',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(180deg, #FEF3C7 0%, #F59E0B 40%, #D97706 70%, #92400E 100%)',
              borderTop: '0.8px solid #FFFBEB',
              borderBottom: '0.8px solid #78350F',
              boxShadow: '0 1px 6px rgba(0, 0, 0, 0.3)',
              zIndex: 1
            }}
          />

          {/* Golden Center Intersecting Ribbon Diamond Knot */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 50%, #B45309 100%)',
              border: '1.2px solid #FDE68A',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.6)',
              zIndex: 3
            }}
          />

          {/* PROMINENT RADIANT WHITE QUESTION MARK '?' (Matches Reference 1) */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '38px',
              fontWeight: 900,
              lineHeight: 1,
              color: '#FFFFFF',
              textShadow: `
                0 0 10px #FFFFFF,
                0 0 20px rgba(254, 240, 138, 0.95),
                0 0 35px rgba(245, 158, 11, 0.85),
                0 2px 4px rgba(0, 0, 0, 0.8)
              `,
              transform: 'translateY(-1px)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
            }}
          >
            ?
          </div>
        </div>
      </div>

      {/* =========================================================================
          KEYFRAME STYLES FOR FLOATING MOTION, SPARKLE TWINKLE, AND PULSE
          ========================================================================= */}
      <style>{`
        /* Smooth Gentle Floating Animation */
        @keyframes pvGiftFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(1.2deg);
          }
        }

        /* Subtle Dynamic Pedestal Glow Pulse */
        @keyframes pvPedestalPulse {
          0%, 100% {
            transform: translateX(-50%) rotateX(68deg) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translateX(-50%) rotateX(68deg) scale(1.08);
            opacity: 1;
          }
        }

        /* Mini Gift Tilted Float */
        @keyframes pvMiniGiftFloat1 {
          0%, 100% {
            transform: translateY(0px) rotate(-18deg);
          }
          50% {
            transform: translateY(-6px) rotate(-14deg);
          }
        }

        @keyframes pvMiniGiftFloat2 {
          0%, 100% {
            transform: translateY(0px) rotate(15deg);
          }
          50% {
            transform: translateY(-7px) rotate(20deg);
          }
        }

        /* Twinkling Sparkles */
        @keyframes pvSparkleTwinkle {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.7) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.25) rotate(45deg);
          }
        }

        .pv-gift-floating-body {
          animation: pvGiftFloat 3.4s ease-in-out infinite;
        }

        .pv-gift-pedestal-ring {
          animation: pvPedestalPulse 3.4s ease-in-out infinite;
        }

        .pv-mini-gift-top-left {
          animation: pvMiniGiftFloat1 3.8s ease-in-out infinite;
        }

        .pv-mini-gift-bottom-left {
          animation: pvMiniGiftFloat2 4.1s ease-in-out infinite 0.4s;
        }

        .pv-sparkle-1 { animation: pvSparkleTwinkle 2.2s ease-in-out infinite; }
        .pv-sparkle-2 { animation: pvSparkleTwinkle 2.8s ease-in-out infinite 0.5s; }
        .pv-sparkle-3 { animation: pvSparkleTwinkle 2.4s ease-in-out infinite 1.1s; }
        .pv-sparkle-4 { animation: pvSparkleTwinkle 3.1s ease-in-out infinite 0.8s; }

        /* Interactive Hover: 3D scale and glow intensifies */
        .pv-gift-box-3d-wrapper:hover .pv-gift-floating-body {
          transform: translateY(-13px) scale(1.06) rotate(-1.5deg) !important;
        }

        .pv-gift-box-3d-wrapper:hover .pv-gift-ambient-glow {
          filter: blur(12px) !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
