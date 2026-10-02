// src/components/ScholarshipResourceModal.jsx
import React, { useEffect } from 'react';
import { X, Clock, BookOpen, CheckCircle2, ArrowRight, Share2, Sparkles, GraduationCap } from 'lucide-react';

export default function ScholarshipResourceModal({ resource, onClose, onOpenOtherResource, allResources = [] }) {
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
                {resource.category || 'Scholarship Guide'}
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
            aria-label="Close modal"
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
              color: '#65676B',
              flexShrink: 0,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#E5E2DC'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F0EFEA'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '1.75rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {resource.sections && resource.sections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '1.75rem' }}>
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#1C1E21',
                marginBottom: '0.6rem'
              }}>
                {sec.heading}
              </h3>
              <div style={{
                fontSize: '0.92rem',
                color: '#374151',
                lineHeight: 1.7,
                whiteSpace: 'pre-line'
              }}>
                {sec.content}
              </div>
            </div>
          ))}

          {resource.tips && resource.tips.length > 0 && (
            <div style={{
              backgroundColor: '#FEF9EE',
              border: '1.5px solid #F1E7D0',
              borderRadius: '16px',
              padding: '1.25rem',
              marginTop: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                color: '#8A5D00',
                fontSize: '0.92rem',
                marginBottom: '0.75rem'
              }}>
                <Sparkles size={16} /> Key Takeaways & Pro Tips
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {resource.tips.map((tip, tIdx) => (
                  <li key={tIdx} style={{ fontSize: '0.86rem', color: '#57410D', lineHeight: 1.55 }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Guides Carousel / List */}
          {allResources && allResources.length > 1 && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid #E8E2D5', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#65676B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
                Other Helpful Guides
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {allResources.filter(r => r.id !== resource.id).slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onOpenOtherResource && onOpenOtherResource(r)}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: '1px solid #E8E2D5',
                      backgroundColor: '#FAFAF8',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C88D2D';
                      e.currentTarget.style.backgroundColor = '#FEF9EE';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E8E2D5';
                      e.currentTarget.style.backgroundColor = '#FAFAF8';
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1E21', marginBottom: '0.35rem' }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#65676B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {r.readTime}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1.5px solid #E8E2D5',
          backgroundColor: '#FDFBF7',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.4rem',
              backgroundColor: '#1C1E21',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
