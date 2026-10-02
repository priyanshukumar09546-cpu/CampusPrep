import React from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { COURSES } from '../data/coursesCatalog';

export default function CourseSelectModal({ isOpen, onClose, targetTab = 'notes', onSelectCourse }) {
  if (!isOpen) return null;

  const targetTitle = targetTab === 'pyqs' ? 'Question Papers (PYQs)' : 'Study Notes & Materials';

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(31, 36, 33, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#FAF7F2',
          border: '1.5px solid #E8E2D5',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(31, 36, 33, 0.25)',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem 1.75rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1.5px solid #E8E2D5',
            color: '#1F2421',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1F2421';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#1F2421';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#FDF6E8',
            border: '1px solid #E8D3B0',
            color: '#A56015',
            padding: '0.25rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            <Sparkles size={13} /> {targetTitle}
          </div>
          <h2 style={{
            fontSize: '1.9rem',
            fontWeight: 900,
            color: '#1F2421',
            margin: '0 0 0.4rem 0',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em'
          }}>
            Choose Your Course
          </h2>
          <p style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#646E78',
            margin: 0
          }}>
            What do you want to study? Select your curriculum to explore resources.
          </p>
        </div>

        {/* 4 Course Selection Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {COURSES.map(course => {
            return (
              <div
                key={course.id}
                onClick={() => {
                  if (onSelectCourse) onSelectCourse(course.key, targetTab);
                  onClose();
                }}
                style={{
                  backgroundColor: '#ffffff',
                  border: `1.5px solid ${course.borderColor}`,
                  borderRadius: '20px',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 6px 16px rgba(35,30,25,0.04)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px rgba(35,30,25,0.1)';
                  e.currentTarget.style.borderColor = course.btnColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(35,30,25,0.04)';
                  e.currentTarget.style.borderColor = course.borderColor;
                }}
              >
                {/* Course Illustration Preview */}
                <div style={{
                  height: '86px',
                  borderRadius: '14px',
                  backgroundColor: course.bgGradient.includes('linear') ? '#FAF7F2' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  {course.id === 'btech' && (
                    <svg viewBox="0 0 160 86" fill="none" style={{ width: '100%', height: '100%' }}>
                      <rect x="25" y="18" width="68" height="44" rx="4" fill="#1E293B" />
                      <rect x="28" y="21" width="62" height="38" rx="2" fill="#0F172A" />
                      <text x="59" y="44" fill="#38BDF8" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
                      <path d="M15 62 L103 62 L97 68 L21 68 Z" fill="#94A3B8" />
                      <path d="M96 34 C96 24 110 24 116 28 C122 24 136 24 136 34 L138 48 H94 Z" fill="#FBBF24" />
                      <rect x="18" y="68" width="46" height="6" rx="1.5" fill="#2563EB" />
                    </svg>
                  )}
                  {course.id === 'mca' && (
                    <svg viewBox="0 0 160 86" fill="none" style={{ width: '100%', height: '100%' }}>
                      <rect x="20" y="16" width="75" height="48" rx="5" fill="#1E293B" />
                      <rect x="24" y="20" width="67" height="40" rx="2" fill="#0F172A" />
                      <text x="57" y="44" fill="#60A5FA" fontFamily="monospace" fontSize="15" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
                      <path d="M10 64 L105 64 L98 71 L17 71 Z" fill="#94A3B8" />
                      <ellipse cx="118" cy="46" rx="16" ry="6" fill="#60A5FA" />
                      <path d="M102 46 v8 c0 3.3 7.2 6 16 6 s16 -2.7 16 -6 v-8" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.2" />
                    </svg>
                  )}
                  {course.id === 'mba' && (
                    <svg viewBox="0 0 160 86" fill="none" style={{ width: '100%', height: '100%' }}>
                      <rect x="25" y="46" width="8" height="18" rx="1.5" fill="#FCD34D" />
                      <rect x="36" y="34" width="8" height="30" rx="1.5" fill="#F59E0B" />
                      <rect x="47" y="22" width="8" height="42" rx="1.5" fill="#D97706" />
                      <rect x="58" y="12" width="8" height="52" rx="1.5" fill="#B45309" />
                      <path d="M22 50 L58 10 L66 16" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <rect x="68" y="30" width="56" height="38" rx="5" fill="#854D0E" stroke="#713F12" strokeWidth="1.5" />
                      <rect x="68" y="42" width="56" height="5" fill="#713F12" />
                      <rect x="91" y="39" width="10" height="10" rx="2" fill="#FBBF24" />
                    </svg>
                  )}
                  {course.id === 'bpharm' && (
                    <svg viewBox="0 0 160 86" fill="none" style={{ width: '100%', height: '100%' }}>
                      <rect x="48" y="24" width="32" height="42" rx="6" fill="#BE185D" stroke="#9D174D" strokeWidth="1.5" />
                      <rect x="54" y="18" width="20" height="7" rx="1.5" fill="#FFFFFF" stroke="#9D174D" strokeWidth="1.2" />
                      <rect x="61" y="36" width="6" height="18" rx="1" fill="#FFFFFF" />
                      <rect x="55" y="42" width="18" height="6" rx="1" fill="#FFFFFF" />
                      <path d="M90 44 C90 58 116 58 116 44 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
                      <line x1="95" y1="30" x2="108" y2="50" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                {/* Course Metadata */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#1F2421',
                      margin: 0
                    }}>
                      {course.name}
                    </h3>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FAF7F2',
                      color: course.btnColor,
                      border: `1px solid ${course.borderColor}`
                    }}>
                      {course.id === 'btech' ? '8 Branches' : `${course.semesters ? course.semesters.length : 4} Sems`}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '0.35rem'
                  }}>
                    {course.fullName}
                  </div>

                  <p style={{
                    fontSize: '0.74rem',
                    color: '#646E78',
                    lineHeight: 1.35,
                    margin: '0 0 1rem 0'
                  }}>
                    {course.description}
                  </p>
                </div>

                {/* Select Button */}
                <button
                  type="button"
                  style={{
                    backgroundColor: course.btnColor,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    boxShadow: `0 4px 12px ${course.btnColor}33`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>Open {course.name} {targetTab === 'pyqs' ? 'PYQs' : 'Notes'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
