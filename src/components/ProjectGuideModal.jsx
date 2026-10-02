// src/components/ProjectGuideModal.jsx
import React from 'react';
import { X, Clock, BookOpen, Share2, Check, ArrowRight } from 'lucide-react';

export default function ProjectGuideModal({ guide, isOpen, onClose }) {
  if (!isOpen || !guide) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(23, 20, 18, 0.72)',
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
        borderRadius: '20px',
        width: '100%',
        maxWidth: '740px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        border: '1px solid #E8E2D5',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem 1.25rem',
          borderBottom: '1px solid #E8E2D5',
          backgroundColor: '#FAF7F2',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'none',
              border: 'none',
              color: '#7A6F62',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#FDF6E8',
            color: '#B45309',
            fontSize: '0.74rem',
            fontWeight: 800,
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            marginBottom: '0.65rem',
            border: '1px solid #FDE68A'
          }}>
            <BookOpen size={13} /> {guide.category || 'Engineering Guide'}
          </div>

          <h2 style={{
            margin: '0 0 0.5rem',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#1F2421',
            lineHeight: 1.3
          }}>
            {guide.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#78716C', fontSize: '0.82rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> {guide.readTime}
            </span>
            <span>•</span>
            <span>ProfessorVirus Academic Editorial</span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem', color: '#292524', lineHeight: 1.7, fontSize: '0.94rem' }}>
          {guide.summary && (
            <div style={{
              backgroundColor: '#F5F5F4',
              borderLeft: '4px solid #C88D2D',
              padding: '0.9rem 1.2rem',
              borderRadius: '0 10px 10px 0',
              fontStyle: 'italic',
              marginBottom: '1.75rem',
              color: '#44403C'
            }}>
              {guide.summary}
            </div>
          )}

          {guide.sections && guide.sections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '1.85rem' }}>
              <h3 style={{
                fontSize: '1.12rem',
                fontWeight: 800,
                color: '#781416',
                marginBottom: '0.65rem',
                paddingBottom: '0.35rem',
                borderBottom: '1px dashed #E7E5E4'
              }}>
                {sec.heading}
              </h3>
              <div style={{ whiteSpace: 'pre-line', color: '#44403C' }}>
                {sec.content}
              </div>
            </div>
          ))}

          {/* Bottom Actions */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #E7E5E4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#A8A29E' }}>
              AKTU B.Tech Project Preparation Hub
            </span>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1.4rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
