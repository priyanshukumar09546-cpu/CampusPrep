// src/components/CareerResourceModal.jsx
import React, { useEffect } from 'react';
import { X, Clock, BookOpen, CheckCircle2, ArrowRight, Share2, Sparkles } from 'lucide-react';

export default function CareerResourceModal({ resource, onClose, onOpenOtherResource }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!resource) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(28, 30, 33, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(35, 30, 25, 0.2)',
        border: '1.5px solid #E8E2D5',
        overflow: 'hidden',
        animation: 'modalSlideUp 0.25s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1.5px solid #E8E2D5',
          backgroundColor: '#FDFBF7',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{
                backgroundColor: '#FDF6E8',
                color: '#C88D2D',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                border: '1px solid #F6E2B3'
              }}>
                {resource.category || 'Career Guide'}
              </span>
              <span style={{
                color: '#65676B',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Clock size={13} /> {resource.readTime}
              </span>
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#1C1E21',
              lineHeight: 1.3
            }}>
              {resource.title}
            </h2>
            <p style={{
              margin: '0.35rem 0 0',
              fontSize: '0.88rem',
              color: '#65676B',
              lineHeight: 1.45
            }}>
              {resource.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F0EFEA',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4B5563',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{
          padding: '1.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          color: '#2D3238',
          fontSize: '0.92rem',
          lineHeight: 1.65
        }}>
          {/* Summary Box */}
          <div style={{
            backgroundColor: '#FEF9EE',
            border: '1px solid #E8CDA1',
            borderRadius: '16px',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            gap: '0.85rem',
            alignItems: 'flex-start'
          }}>
            <Sparkles size={20} color="#C88D2D" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', color: '#8A5D00', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                Executive Takeaway
              </strong>
              <span style={{ color: '#5B4000', fontSize: '0.88rem' }}>
                {resource.summary}
              </span>
            </div>
          </div>

          {/* Guide Sections */}
          {resource.sections && resource.sections.map((sec, idx) => (
            <div key={idx} style={{
              backgroundColor: '#FAFAF7',
              borderRadius: '16px',
              border: '1px solid #E8E2D5',
              padding: '1.35rem'
            }}>
              <h3 style={{
                margin: '0 0 0.75rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#781416',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <BookOpen size={16} color="#781416" />
                {sec.title}
              </h3>
              <div style={{
                whiteSpace: 'pre-line',
                color: '#374151',
                fontSize: '0.89rem',
                lineHeight: 1.65
              }}>
                {sec.content}
              </div>
            </div>
          ))}

          {/* Actionable Checklist */}
          {resource.checklist && (
            <div style={{
              backgroundColor: '#F3FAF5',
              borderRadius: '16px',
              border: '1px solid #C4E7D0',
              padding: '1.35rem'
            }}>
              <h4 style={{
                margin: '0 0 0.8rem',
                fontSize: '0.98rem',
                fontWeight: 800,
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={18} color="#166534" />
                Actionable Implementation Checklist
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {resource.checklist.map((chk, cIdx) => (
                  <li key={cIdx} style={{ color: '#15803D', fontSize: '0.88rem' }}>
                    {chk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1.5px solid #E8E2D5',
          backgroundColor: '#FDFBF7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#65676B' }}>
            ProfessorVirus Career & Placement Cell
          </span>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#781416',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.55rem 1.4rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(120, 20, 22, 0.25)'
            }}
          >
            <span>Close Guide</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
