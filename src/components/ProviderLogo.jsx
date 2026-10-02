// src/components/ProviderLogo.jsx
import React, { useState } from 'react';
import { Building2, Landmark, ShieldCheck } from 'lucide-react';

/**
 * Robust Provider Logo component with multi-level fallback
 * Guarantees zero broken images
 */
export default function ProviderLogo({
  logoUrl,
  providerName = 'Provider',
  size = 46,
  borderRadius = 12,
  style = {},
  className = ''
}) {
  const [imgError, setImgError] = useState(false);

  // Compute clean, readable initials from provider name
  const getInitials = (name) => {
    if (!name) return 'SP';
    const clean = name.replace(/^(The|All India|Government of|Ministry of)\s+/i, '');
    const words = clean.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  // Harmonious theme color for fallback
  const getThemeColor = (name) => {
    const colors = [
      { bg: '#FEF2F2', text: '#781416', border: '#FECACA' }, // Maroon
      { bg: '#FEF9EE', text: '#8A5D00', border: '#FDE68A' }, // Gold
      { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' }, // Blue
      { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' }, // Green
      { bg: '#FAF5FF', text: '#7E22CE', border: '#E9D5FF' }  // Purple
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const theme = getThemeColor(providerName);
  const initials = getInitials(providerName);
  const hasValidLogo = Boolean(logoUrl && !imgError);

  return (
    <div
      className={className}
      title={providerName}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: `${borderRadius}px`,
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E8E2D5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        flexShrink: 0,
        ...style
      }}
    >
      {hasValidLogo ? (
        <img
          src={logoUrl}
          alt={providerName}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '4px',
            display: 'block'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: theme.bg,
            color: theme.text,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: size > 40 ? '0.78rem' : '0.68rem',
            letterSpacing: '0.5px',
            lineHeight: 1,
            userSelect: 'none'
          }}
        >
          <span>{initials}</span>
        </div>
      )}
    </div>
  );
}
