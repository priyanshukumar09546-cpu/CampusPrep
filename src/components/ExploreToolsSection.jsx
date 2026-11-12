import React from 'react';
import {
  Target,
  FileText,
  BookOpen,
  BarChart2,
  Briefcase,
  Mic,
  TrendingUp,
  Rocket,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function ExploreToolsSection({ onNavigate }) {
  const tools = [
    {
      id: 'notes',
      title: 'Study Notes',
      desc: 'Complete, well-organized notes',
      icon: Target,
      color: '#E11D48',
      bgLight: '#FFF1F2'
    },
    {
      id: 'pyqs',
      title: 'PYQs',
      desc: 'Previous year papers',
      icon: FileText,
      color: '#7C3AED',
      bgLight: '#F5F3FF'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      desc: 'Branch-wise syllabus',
      icon: BookOpen,
      color: '#16A34A',
      bgLight: '#F0FDF4'
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      desc: 'Practice topic-wise',
      icon: BarChart2,
      color: '#2563EB',
      bgLight: '#EFF6FF'
    },
    {
      id: 'resume-maker',
      title: 'Resume Maker',
      desc: 'Build ATS resume',
      icon: Briefcase,
      color: '#D97706',
      bgLight: '#FFFBEB'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      desc: 'AI mock interviews',
      icon: Mic,
      color: '#9333EA',
      bgLight: '#FAF5FF'
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      desc: 'Track your performance',
      icon: TrendingUp,
      color: '#059669',
      bgLight: '#ECFDF5'
    },
    {
      id: 'prma-home',
      title: 'Career Growth',
      desc: 'PRMA Tech industry tracks',
      icon: Rocket,
      color: '#DC2626',
      bgLight: '#FEF2F2'
    }
  ];

  return (
    <section
      style={{
        backgroundColor: '#FFFFFF',
        padding: '2rem 0 4.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 1.5rem',
          position: 'relative'
        }}
      >
        {/* Main Section Card (Match Reference Image 2) */}
        <div
          style={{
            backgroundColor: '#FAFAFC',
            borderRadius: '28px',
            border: '1.5px solid #E2E8F0',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 2.5fr',
            gap: '2.5rem',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
          className="pv-explore-tools-grid"
        >
          {/* Subtle Graduation Cap Watermark Outline on Far Right */}
          <div
            style={{
              position: 'absolute',
              right: '-40px',
              bottom: '-40px',
              opacity: 0.05,
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            <GraduationCap size={280} color="#0F172A" />
          </div>

          {/* ===============================================================
              LEFT COLUMN: HEADER, COPY & EXPLORE ALL BUTTON
              =============================================================== */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#881337',
                color: '#FFFFFF',
                borderRadius: '999px',
                padding: '0.35rem 0.95rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: '1rem',
                boxShadow: '0 2px 8px rgba(136, 19, 55, 0.25)'
              }}
            >
              <span>⭐</span>
              <span>Explore Our Tools</span>
            </div>

            {/* Headline */}
            <h2
              style={{
                fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                fontSize: 'clamp(1.75rem, 2.6vw, 2.35rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#0F172A',
                margin: '0 0 0.85rem 0',
                letterSpacing: '-0.02em'
              }}
            >
              Everything You Need for <br />
              <span style={{ color: '#881337' }}>Academic Success</span>
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '0.92rem',
                color: '#64748B',
                lineHeight: 1.55,
                margin: '0 0 1.75rem 0',
                fontWeight: 500
              }}
            >
              Powerful tools to learn, practice, and grow in your career.
            </p>

            {/* Explore All Tools Button */}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('more')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#881337',
                color: '#FFFFFF',
                borderRadius: '999px',
                padding: '0.75rem 1.6rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 14px rgba(136, 19, 55, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#70102B';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#881337';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Explore All Tools</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* ===============================================================
              RIGHT COLUMN: 4×2 GRID OF 8 TOOL CARDS
              =============================================================== */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              position: 'relative',
              zIndex: 1
            }}
            className="pv-tools-8card-grid pv-reveal-group"
          >
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => onNavigate && onNavigate(tool.id)}
                  className={`pv-reveal-card pv-stagger-${(idx % 8) + 1}`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    padding: '1.15rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#881337';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(136, 19, 55, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: tool.bgLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tool.color,
                      flexShrink: 0
                    }}
                  >
                    <Icon size={19} strokeWidth={2.4} />
                  </div>

                  {/* Title & Desc */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: '#0F172A',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {tool.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: '#64748B',
                        marginTop: '0.15rem',
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {tool.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .pv-explore-tools-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .pv-tools-8card-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .pv-tools-8card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
