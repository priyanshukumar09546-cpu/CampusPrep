import React from 'react';

/**
 * GiftLabel — Promotional Pill Badge matching Reference Image 1
 * Displays "Get Your Gift!" and "→ Tap Here 👆" with mini gift icon.
 */
export default function GiftLabel({ onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Get Your Gift! — Tap Here"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick();
        }
      }}
      className="pv-gift-promotional-label"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: 'linear-gradient(135deg, #781416 0%, #631012 50%, #4C0B0D 100%)',
        border: '1.5px solid #F59E0B',
        borderRadius: '9999px',
        padding: '0.42rem 0.95rem 0.42rem 0.65rem',
        boxShadow: '0 8px 24px rgba(120, 20, 22, 0.45), 0 0 16px rgba(245, 158, 11, 0.3)',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.22s ease',
        whiteSpace: 'nowrap'
      }}
    >
      {/* Mini 3D Gift Icon */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #991B1B 0%, #781416 100%)',
          border: '1px solid #FDE68A',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0
        }}
      >
        <span style={{ fontSize: '18px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}>
          🎁
        </span>
      </div>

      {/* Text Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
        {/* Main Title: Get Your Gift! */}
        <div style={{
          fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '0.94rem',
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span>Get Your</span>
          <span style={{ color: '#FDE047' }}>Gift!</span>
        </div>

        {/* Subtitle: -> Tap Here 👆 */}
        <div style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#FBBF24',
          letterSpacing: '0.02em',
          marginTop: '0.12rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <span>→ Tap Here</span>
          <span style={{ fontSize: '0.8rem' }}>👆</span>
        </div>
      </div>

      <style>{`
        .pv-gift-promotional-label:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 12px 28px rgba(120, 20, 22, 0.55), 0 0 20px rgba(245, 158, 11, 0.45) !important;
          border-color: #FDE047 !important;
        }
      `}</style>
    </div>
  );
}
