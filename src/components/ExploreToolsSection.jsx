import React from 'react';
import {
  BookOpen,
  FileText,
  GraduationCap,
  Briefcase,
  Mic,
  FileCode2,
  BarChart2,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ExploreToolsSection({ onNavigate }) {
  const { isDark } = useTheme();
  const tools = [
    {
      id: 'hoollow',
      title: 'HOOLLOW AI Roadmap',
      desc: 'AI-generated personalized learning roadmaps with curated resources & tasks.',
      buttonText: 'Generate Roadmap →',
      icon: Sparkles,
      iconBg: 'rgba(255, 184, 0, 0.1)',
      iconBorder: 'rgba(255, 184, 0, 0.3)',
      iconColor: '#FFB800',
      btnBg: 'rgba(255, 184, 0, 0.08)',
      btnBorder: 'rgba(255, 184, 0, 0.3)',
      btnColor: '#FFB800',
      hoverBorder: '#FFB800'
    },
    {
      id: 'notes',
      title: 'Notes',
      desc: 'High-quality unit-wise study material for engineering students.',
      buttonText: 'Explore Notes →',
      icon: BookOpen,
      iconBg: 'rgba(236, 72, 153, 0.1)',
      iconBorder: 'rgba(236, 72, 153, 0.3)',
      iconColor: '#EC4899',
      btnBg: 'rgba(236, 72, 153, 0.08)',
      btnBorder: 'rgba(236, 72, 153, 0.3)',
      btnColor: '#F472B6',
      hoverBorder: '#EC4899'
    },
    {
      id: 'pyqs',
      title: 'PYQs',
      desc: 'Previous year question papers for AKTU and engineering subjects.',
      buttonText: 'Explore PYQs →',
      icon: FileText,
      iconBg: 'rgba(245, 158, 11, 0.1)',
      iconBorder: 'rgba(245, 158, 11, 0.3)',
      iconColor: '#F59E0B',
      btnBg: 'rgba(245, 158, 11, 0.08)',
      btnBorder: 'rgba(245, 158, 11, 0.3)',
      btnColor: '#FBBF24',
      hoverBorder: '#F59E0B'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      desc: 'Official and updated syllabus for engineering branches.',
      buttonText: 'Explore Syllabus →',
      icon: GraduationCap,
      iconBg: 'rgba(168, 85, 247, 0.1)',
      iconBorder: 'rgba(168, 85, 247, 0.3)',
      iconColor: '#A855F7',
      btnBg: 'rgba(168, 85, 247, 0.08)',
      btnBorder: 'rgba(168, 85, 247, 0.3)',
      btnColor: '#C084FC',
      hoverBorder: '#A855F7'
    },
    {
      id: 'internships-jobs',
      title: 'Internships & Jobs',
      desc: 'Find internships, jobs, and career opportunities.',
      buttonText: 'Explore Opportunities →',
      icon: Briefcase,
      iconBg: 'rgba(59, 130, 246, 0.1)',
      iconBorder: 'rgba(59, 130, 246, 0.3)',
      iconColor: '#3B82F6',
      btnBg: 'rgba(59, 130, 246, 0.08)',
      btnBorder: 'rgba(59, 130, 246, 0.3)',
      btnColor: '#60A5FA',
      hoverBorder: '#3B82F6'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      isBeta: true,
      desc: 'AI-powered mock interviews and coding practice.',
      buttonText: 'Start Practice →',
      icon: Mic,
      iconBg: 'rgba(239, 68, 68, 0.1)',
      iconBorder: 'rgba(239, 68, 68, 0.3)',
      iconColor: '#EF4444',
      btnBg: 'rgba(239, 68, 68, 0.08)',
      btnBorder: 'rgba(239, 68, 68, 0.3)',
      btnColor: '#F87171',
      hoverBorder: '#EF4444'
    },
    {
      id: 'pdf-maker',
      title: 'PDF Maker & Splitter',
      desc: 'Merge, split, convert, and manage PDF files.',
      buttonText: 'Open PDF Tools →',
      icon: FileCode2,
      iconBg: 'rgba(16, 185, 129, 0.1)',
      iconBorder: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#10B981',
      btnBg: 'rgba(16, 185, 129, 0.08)',
      btnBorder: 'rgba(16, 185, 129, 0.3)',
      btnColor: '#34D399',
      hoverBorder: '#10B981'
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      desc: 'Analyze your academic performance and track your results.',
      buttonText: 'Check Result →',
      icon: BarChart2,
      iconBg: 'rgba(255, 140, 0, 0.1)',
      iconBorder: 'rgba(255, 140, 0, 0.3)',
      iconColor: '#FF8C00',
      btnBg: 'rgba(255, 140, 0, 0.08)',
      btnBorder: 'rgba(255, 140, 0, 0.3)',
      btnColor: '#FFA500',
      hoverBorder: '#FF8C00'
    },
    {
      id: 'scholarships',
      title: 'Scholarships & Grants',
      desc: 'Explore government and private scholarship opportunities.',
      buttonText: 'Explore Scholarships →',
      icon: Award,
      iconBg: 'rgba(139, 92, 246, 0.1)',
      iconBorder: 'rgba(139, 92, 246, 0.3)',
      iconColor: '#8B5CF6',
      btnBg: 'rgba(139, 92, 246, 0.08)',
      btnBorder: 'rgba(139, 92, 246, 0.3)',
      btnColor: '#A78BFA',
      hoverBorder: '#8B5CF6'
    }
  ];

  return (
    <section className="pv-scroll-reveal" style={{
      backgroundColor: 'transparent',
      padding: '2.5rem 0 3.5rem 0',
      position: 'relative'
    }}>
      <div className="container pv-main-container" style={{ maxWidth: 'min(1560px, 94vw)', margin: '0 auto', padding: '0 clamp(1rem, 2.5vw, 2.5rem)' }}>
        
        {/* Section Header with Title & View All Tools Button */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
              fontWeight: 900,
              color: isDark ? '#FFFFFF' : '#1F2421',
              margin: '0 0 0.35rem 0',
              lineHeight: 1.2
            }}>
              Explore Our <span style={{ color: isDark ? '#FFB800' : '#E59500', textShadow: isDark ? '0 0 15px rgba(255, 184, 0, 0.35)' : 'none' }}>Tools</span>
            </h2>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.92rem',
              color: isDark ? '#A1A1AA' : '#64748B',
              margin: 0,
              fontWeight: 500
            }}>
              Everything you need for your academic, interview and career preparation in one place.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('prma-internships-home')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                border: isDark ? '1px solid rgba(112, 37, 232, 0.4)' : '1.5px solid #E0DBF5',
                backgroundColor: isDark ? 'rgba(112, 37, 232, 0.12)' : '#F5F2FF',
                color: isDark ? '#FFFFFF' : '#101C50',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                boxShadow: isDark ? '0 4px 16px rgba(112, 37, 232, 0.25)' : '0 2px 8px rgba(112, 37, 232, 0.08)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(112, 37, 232, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDark ? '0 4px 16px rgba(112, 37, 232, 0.25)' : '0 2px 8px rgba(112, 37, 232, 0.08)';
              }}
            >
              <img
                src="/assets/prma_tech_logo.png"
                alt="PRMA Tech"
                style={{ height: '16px', objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>PRMA Tech Internships</span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.12rem 0.45rem',
                borderRadius: '9999px',
                backgroundColor: '#7025E8',
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                lineHeight: 1.2
              }}>
                New
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('more')}
              style={{
                padding: '0.55rem 1.35rem',
                borderRadius: '9999px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1.5px solid #D5CEBF',
                backgroundColor: isDark ? '#0B0B0B' : '#FFFFFF',
                color: isDark ? '#E4E4E7' : '#1F2421',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.borderColor = '#FFB800';
                  e.currentTarget.style.color = '#FFB800';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 184, 0, 0.25)';
                } else {
                  e.currentTarget.style.borderColor = '#861820';
                  e.currentTarget.style.color = '#861820';
                }
              }}
              onMouseLeave={(e) => {
                if (isDark) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#E4E4E7';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                } else {
                  e.currentTarget.style.borderColor = '#D5CEBF';
                  e.currentTarget.style.color = '#1F2421';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                }
              }}
            >
              <span>View All Tools</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Tools Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem'
        }} className="explore-tools-grid">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate && onNavigate(tool.id)}
                style={{
                  backgroundColor: isDark ? '#0B0B0B' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1.5px solid #E8E2D5',
                  borderRadius: '18px',
                  padding: '1.4rem 1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = tool.hoverBorder;
                  e.currentTarget.style.boxShadow = isDark 
                    ? '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.15)'
                    : '0 8px 24px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E8E2D5';
                  e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.04)';
                }}
              >
                <div>
                  {/* Top Icon Box */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: tool.iconBg,
                    border: `1px solid ${tool.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tool.iconColor,
                    marginBottom: '1rem',
                    boxShadow: isDark ? '0 0 10px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.06)'
                  }}>
                    <Icon size={20} strokeWidth={2.2} />
                  </div>

                  {/* Title with optional Beta badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginBottom: '0.45rem'
                  }}>
                    <h3 style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.08rem',
                      fontWeight: 900,
                      color: isDark ? '#FFFFFF' : '#1F2421',
                      margin: 0,
                      lineHeight: 1.2
                    }}>
                      {tool.title}
                    </h3>
                    {tool.isBeta && (
                      <span style={{
                        backgroundColor: '#FFB800',
                        color: '#000000',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px',
                        lineHeight: 1.15
                      }}>
                        Beta
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.84rem',
                    color: isDark ? '#A1A1AA' : '#64748B',
                    lineHeight: 1.5,
                    margin: '0 0 1.25rem 0',
                    fontWeight: 400
                  }}>
                    {tool.desc}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div>
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '10px',
                      border: `1px solid ${tool.btnBorder}`,
                      backgroundColor: tool.btnBg,
                      color: tool.btnColor,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = tool.iconColor;
                      e.currentTarget.style.color = '#000000';
                      e.currentTarget.style.boxShadow = `0 0 15px ${tool.iconColor}66`;
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = tool.btnBg;
                      e.currentTarget.style.color = tool.btnColor;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span>{tool.buttonText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Responsive Stacking */}
      <style>{`
        @media (max-width: 1024px) {
          .explore-tools-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .explore-tools-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
