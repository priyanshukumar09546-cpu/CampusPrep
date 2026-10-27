import React from 'react';
import { Clock, Sparkles } from 'lucide-react';

/**
 * Professional Coming Soon Tag / Badge matching the ProfessorVirus website theme.
 * Displays: "Coming Soon — Before University Exam..THANK YOU!!"
 */
export default function ComingSoonBadge({
  variant = 'badge', // 'badge' | 'pill' | 'chip' | 'banner'
  resourceType,
  subjectName,
  text = 'Coming Soon — Before University Exam..THANK YOU!!',
  style = {},
  className = ''
}) {
  if (variant === 'banner') {
    return (
      <div
        className={`pv-coming-soon-banner ${className}`}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px dashed #FCD34D',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          boxShadow: '0 2px 10px rgba(122, 35, 39, 0.03)',
          margin: '0.75rem 0',
          ...style
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            border: '2px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7A2327'
          }}
        >
          <Clock size={22} strokeWidth={2.4} />
        </div>

        {/* Small, clean, professional badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: '#FFFBEB',
            border: '1.5px solid #FCD34D',
            color: '#7A2327',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '-0.01em',
            boxShadow: '0 2px 6px rgba(122, 35, 39, 0.05)'
          }}
        >
          <Sparkles size={14} color="#C88D2D" />
          <span>{text}</span>
        </div>

        <p
          style={{
            fontSize: '0.82rem',
            color: '#64748B',
            margin: '0.15rem 0 0 0',
            maxWidth: '440px',
            lineHeight: 1.45,
            fontWeight: 500
          }}
        >
          {resourceType && subjectName
            ? `Verified ${resourceType} for ${subjectName} are currently being prepared and verified. They will be uploaded before the university exam.`
            : resourceType
            ? `Verified ${resourceType} are being prepared and verified by the academic team. They will be uploaded before the university exam.`
            : 'Study materials are being prepared and will be published before the university examination.'}
        </p>
      </div>
    );
  }

  if (variant === 'chip') {
    return (
      <span
        className={`pv-coming-soon-chip ${className}`}
        title={text}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.15rem 0.45rem',
          borderRadius: '9999px',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FCD34D',
          color: '#7A2327',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: '0.68rem',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ...style
        }}
      >
        <Clock size={10} color="#C88D2D" style={{ flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
      </span>
    );
  }

  // Default 'badge' or 'pill'
  const isPill = variant === 'pill';
  return (
    <span
      className={`pv-coming-soon-badge ${className}`}
      title={text}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: isPill ? '0.18rem 0.55rem' : '0.24rem 0.65rem',
        borderRadius: '9999px',
        backgroundColor: '#FFFBEB',
        border: '1px solid #FCD34D',
        color: '#7A2327',
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        fontSize: isPill ? '0.72rem' : '0.78rem',
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
        boxShadow: '0 1px 3px rgba(122, 35, 39, 0.04)',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        ...style
      }}
    >
      <Clock size={isPill ? 11 : 12} color="#C88D2D" style={{ flexShrink: 0 }} />
      <span>{text}</span>
    </span>
  );
}
