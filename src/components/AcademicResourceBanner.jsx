import React from 'react';
import { 
  FileText, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Award,
  Zap,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';

export default function AcademicResourceBanner({ onNavigate }) {
  const academicPillars = [
    {
      id: 'pyqs',
      tag: 'University Papers',
      title: 'Previous Year Papers (PYQs)',
      subtitle: 'AKTU Solved & Unsolved',
      desc: 'Semester-wise authentic university exam papers from 2018 to 2025 with step-by-step verified solutions.',
      stats: '1,900+ Solved Papers',
      icon: FileText,
      accentColor: '#B91C1C',
      accentBg: '#FEF2F2',
      badgeBg: '#FEE2E2',
      badgeText: '#991B1B',
      gradient: 'linear-gradient(135deg, rgba(254,242,242,0.85) 0%, rgba(255,255,255,0.95) 100%)',
      border: '1.5px solid #FECACA',
      highlightBadge: 'AKTU Format'
    },
    {
      id: 'notes',
      tag: 'Handwritten & Quantum',
      title: 'Verified Notes Library',
      subtitle: 'Unit-by-Unit Mastery',
      desc: 'Topper-verified handwritten notes, Quantum series condensations, formulas, and high-yield concept summaries.',
      stats: '5,400+ Verified Units',
      icon: BookOpen,
      accentColor: '#C88D2D',
      accentBg: '#FFFBEB',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
      gradient: 'linear-gradient(135deg, rgba(255,251,235,0.85) 0%, rgba(255,255,255,0.95) 100%)',
      border: '1.5px solid #FDE68A',
      highlightBadge: 'Topper Notes'
    },
    {
      id: 'syllabus',
      tag: 'Official Curriculum',
      title: 'Course Syllabus',
      subtitle: 'Official University Schema',
      desc: 'Updated AKTU NEP and non-NEP syllabus schemes for all B.Tech branches, BCA, MCA with exact unit-credit splits.',
      stats: 'All Branches & Semesters',
      icon: GraduationCap,
      accentColor: '#047857',
      accentBg: '#ECFDF5',
      badgeBg: '#D1FAE5',
      badgeText: '#065F46',
      gradient: 'linear-gradient(135deg, rgba(236,253,245,0.85) 0%, rgba(255,255,255,0.95) 100%)',
      border: '1.5px solid #A7F3D0',
      highlightBadge: '2024-25 Revised'
    },
    {
      id: 'quizzes',
      tag: 'Topic Assessment',
      title: 'Interactive Quizzes',
      subtitle: 'Concept Readiness Drills',
      desc: 'Targeted multiple-choice quizzes designed around recurrent AKTU short-answer & mid-term exam questions.',
      stats: 'Instant Score & Analysis',
      icon: Zap,
      accentColor: '#4F46E5',
      accentBg: '#EEF2FF',
      badgeBg: '#E0E7FF',
      badgeText: '#3730A3',
      gradient: 'linear-gradient(135deg, rgba(238,242,255,0.85) 0%, rgba(255,255,255,0.95) 100%)',
      border: '1.5px solid #C7D2FE',
      highlightBadge: 'Practice Mode'
    }
  ];

  return (
    <section 
      className="academic-resource-banner-wrapper"
      style={{
        position: 'relative',
        backgroundColor: '#FAF7F2',
        backgroundImage: `
          radial-gradient(rgba(200, 141, 45, 0.08) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #FAF7F2 0%, #F4EFE6 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '3.75rem 0 4.25rem 0',
        borderBottom: '1.5px solid #E8E2D5',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Background Glow Spheres */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '10%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120, 20, 22, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        right: '8%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200, 141, 45, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* MAIN PRODUCT SHOWCASE CONTAINER */}
        <div 
          className="academic-banner-card"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E8E2D5',
            boxShadow: '0 20px 48px rgba(35, 30, 25, 0.07)',
            padding: '2.75rem 2.25rem',
            maxWidth: '1160px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Decorative Header Accent Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #781416 0%, #C88D2D 50%, #047857 100%)'
          }} />

          {/* HEADER SECTION */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.75rem auto' }}>
            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#781416',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              boxShadow: '0 2px 6px rgba(120, 20, 22, 0.06)'
            }}>
              <Sparkles size={14} style={{ color: '#781416' }} />
              The Complete Academic Arsenal
            </div>

            {/* Main Headline */}
            <h2 
              className="academic-banner-title"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '2.35rem',
                fontWeight: 900,
                color: '#1F2421',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                margin: '0 0 1rem 0'
              }}
            >
              Everything You Need to <span style={{ color: '#781416' }}>Prepare Better</span>
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.02rem',
              color: '#55606E',
              lineHeight: 1.6,
              margin: '0 auto',
              maxWidth: '680px'
            }}>
              Structured, verified, and mapped to the official AKTU university syllabus. Four dedicated academic pillars to ace exams, eliminate guesswork, and graduate with a higher CGPA.
            </p>
          </div>

          {/* 4 PILLARS VISUAL GRID */}
          <div 
            className="academic-four-pillars-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.25rem',
              marginBottom: '2.5rem'
            }}
          >
            {academicPillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  onClick={() => onNavigate && onNavigate(pillar.id)}
                  className="academic-pillar-card"
                  style={{
                    background: pillar.gradient,
                    border: pillar.border,
                    borderRadius: '18px',
                    padding: '1.5rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(35, 30, 25, 0.09)';
                    e.currentTarget.style.borderColor = pillar.accentColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 30, 25, 0.03)';
                    e.currentTarget.style.borderColor = pillar.border.split(' ')[2];
                  }}
                >
                  <div>
                    {/* Top Row: Icon + Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.15rem'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: pillar.accentBg,
                        border: `1.5px solid ${pillar.accentColor}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: pillar.accentColor,
                        boxShadow: `0 4px 12px ${pillar.accentColor}18`
                      }}>
                        <IconComp size={22} />
                      </div>

                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: pillar.badgeBg,
                        color: pillar.badgeText,
                        padding: '0.22rem 0.55rem',
                        borderRadius: '9999px',
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase'
                      }}>
                        {pillar.highlightBadge}
                      </span>
                    </div>

                    {/* Pillar Title */}
                    <h3 style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#1F2421',
                      margin: '0 0 0.4rem 0',
                      lineHeight: 1.3
                    }}>
                      {pillar.title}
                    </h3>

                    {/* Subtitle / Topic */}
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: pillar.accentColor,
                      marginBottom: '0.65rem'
                    }}>
                      {pillar.subtitle}
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.82rem',
                      color: '#64748B',
                      lineHeight: 1.5,
                      margin: '0 0 1rem 0'
                    }}>
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Bottom Stats & CTA */}
                  <div>
                    <div style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#475569',
                      backgroundColor: '#FFFFFF',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      marginBottom: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <CheckCircle2 size={13} style={{ color: pillar.accentColor }} />
                      <span>{pillar.stats}</span>
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: pillar.accentColor,
                      transition: 'gap 0.2s ease'
                    }}>
                      <span>Access {pillar.id.toUpperCase()}</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM SUMMARY TRUST STRIP & DIRECT NAVIGATION */}
          <div 
            className="academic-banner-trust-bar"
            style={{
              backgroundColor: '#FAF7F2',
              borderRadius: '16px',
              border: '1.5px solid #E8E2D5',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#781416',
                flexShrink: 0
              }}>
                <BookmarkCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>
                  AKTU Direct Academic Hub
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Handwritten Notes • Quantum Series • Solved Papers • Unit-wise Quizzes
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate && onNavigate('pyqs')}
                style={{
                  padding: '0.55rem 1.05rem',
                  borderRadius: '10px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(120, 20, 22, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#90181A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#781416'}
              >
                <FileText size={15} /> All PYQs
              </button>

              <button
                onClick={() => onNavigate && onNavigate('notes')}
                style={{
                  padding: '0.55rem 1.05rem',
                  borderRadius: '10px',
                  backgroundColor: '#C88D2D',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(200, 141, 45, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D49635'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C88D2D'}
              >
                <BookOpen size={15} /> All Notes
              </button>

              <button
                onClick={() => onNavigate && onNavigate('syllabus')}
                style={{
                  padding: '0.55rem 1.05rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#1F2421',
                  border: '1.5px solid #E8E2D5',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C88D2D';
                  e.currentTarget.style.backgroundColor = '#FEF9EE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E8E2D5';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <GraduationCap size={15} /> Syllabus
              </button>

              <button
                onClick={() => onNavigate && onNavigate('quizzes')}
                style={{
                  padding: '0.55rem 1.05rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#1F2421',
                  border: '1.5px solid #E8E2D5',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4F46E5';
                  e.currentTarget.style.backgroundColor = '#EEF2FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E8E2D5';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <Zap size={15} /> Quizzes
              </button>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .academic-four-pillars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .academic-four-pillars-grid {
            grid-template-columns: 1fr !important;
          }
          .academic-banner-card {
            padding: 1.75rem 1.25rem !important;
          }
          .academic-banner-title {
            font-size: 1.75rem !important;
          }
          .academic-banner-trust-bar {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .academic-banner-trust-bar > div:last-child {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.5rem !important;
          }
          .academic-banner-trust-bar > div:last-child button {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}
