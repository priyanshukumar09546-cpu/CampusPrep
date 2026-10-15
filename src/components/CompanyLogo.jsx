// src/components/CompanyLogo.jsx
import React, { useState } from 'react';

const LOCAL_LOGOS = {
  amazon: '/assets/companies/amazon.svg',
  microsoft: '/assets/companies/microsoft.svg',
  google: '/assets/companies/google.svg',
  flipkart: '/assets/companies/flipkart.svg',
  tcs: '/assets/companies/tcs.svg',
  'tata consultancy services': '/assets/companies/tcs.svg',
  infosys: '/assets/companies/infosys.svg',
  wipro: '/assets/companies/infosys.svg',
  nvidia: '/assets/companies/nvidia.svg',
  figma: '/assets/companies/figma.svg',
  zoho: '/assets/companies/zoho.svg',
  cisco: '/assets/companies/cisco.svg',
  'cisco systems': '/assets/companies/cisco.svg',
  persistent: '/assets/companies/persistent.svg',
  'persistent systems': '/assets/companies/persistent.svg',
  samsung: '/assets/companies/samsung.svg',
  accenture: '/assets/companies/accenture.svg',
  'accenture india': '/assets/companies/accenture.svg',
};

export default function CompanyLogo({ name = 'Company', logoUrl, size = 48, className = '' }) {
  const [imgError, setImgError] = useState(false);
  const normalized = (name || '').toLowerCase().trim();

  // 1. Check local curated logos first
  let targetSrc = null;
  for (const [key, path] of Object.entries(LOCAL_LOGOS)) {
    if (normalized.includes(key)) {
      targetSrc = path;
      break;
    }
  }

  // 2. If no local match, fall back to opp.companyLogo if valid URL
  if (!targetSrc && logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/'))) {
    targetSrc = logoUrl;
  }

  // Visual container styles matching reference
  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: normalized.includes('amazon') ? '#131921' : '#FFFFFF',
    border: normalized.includes('amazon') ? '1px solid #1F2937' : '1px solid #E2E8F0',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    flexShrink: 0,
    boxSizing: 'border-box'
  };

  if (targetSrc && !imgError) {
    return (
      <div style={containerStyle} className={className}>
        <img
          src={targetSrc}
          alt={`${name} official company logo`}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: normalized.includes('amazon') ? '0' : '3px',
            boxSizing: 'border-box'
          }}
        />
      </div>
    );
  }

  // High quality branded fallback avatar with consistent colors
  const colors = ['#781416', '#0284C7', '#059669', '#7C3AED', '#D97706', '#DB2777', '#4F46E5'];
  const colorIndex = (normalized.charCodeAt(0) + normalized.length) % colors.length;
  const bg = colors[colorIndex];
  const firstLetter = (name || 'C').charAt(0).toUpperCase();

  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: bg,
        color: '#FFFFFF',
        fontWeight: 900,
        fontSize: size > 44 ? '1.15rem' : '0.95rem',
        border: 'none',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
      }}
      className={className}
      title={name}
    >
      {firstLetter}
    </div>
  );
}
