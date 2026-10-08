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
  ArrowRight
} from 'lucide-react';

export default function ExploreToolsSection({ onNavigate }) {
  const tools = [
    {
      id: 'notes',
      title: 'Notes',
      desc: 'High-quality unit-wise study material for engineering students.',
      buttonText: 'Explore Notes →',
      icon: BookOpen,
      iconBg: '#FDF2F8',
      iconBorder: '#FCE7F3',
      iconColor: '#DB2777',
      btnBg: '#FDF2F8',
      btnColor: '#BE185D',
      hoverBorder: '#F472B6'
    },
    {
      id: 'pyqs',
      title: 'PYQs',
      desc: 'Previous year question papers for AKTU and engineering subjects.',
      buttonText: 'Explore PYQs →',
      icon: FileText,
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A',
      iconColor: '#D97706',
      btnBg: '#FEF3C7',
      btnColor: '#B45309',
      hoverBorder: '#FBBF24'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      desc: 'Official and updated syllabus for engineering branches.',
      buttonText: 'Explore Syllabus →',
      icon: GraduationCap,
      iconBg: '#F3E8FF',
      iconBorder: '#E9D5FF',
      iconColor: '#9333EA',
      btnBg: '#F3E8FF',
      btnColor: '#7E22CE',
      hoverBorder: '#C084FC'
    },
    {
      id: 'internships-jobs',
      title: 'Internships & Jobs',
      desc: 'Find internships, jobs, and career opportunities.',
      buttonText: 'Explore Opportunities →',
      icon: Briefcase,
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      iconColor: '#2563EB',
      btnBg: '#EFF6FF',
      btnColor: '#1D4ED8',
      hoverBorder: '#60A5FA'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      isBeta: true,
      desc: 'AI-powered mock interviews and coding practice.',
      buttonText: 'Start Practice →',
      icon: Mic,
      iconBg: '#FEF2F2',
      iconBorder: '#FEE2E2',
      iconColor: '#DC2626',
      btnBg: '#FEF2F2',
      btnColor: '#B91C1C',
      hoverBorder: '#F87171'
    },
    {
      id: 'pdf-maker',
      title: 'PDF Maker & Splitter',
      desc: 'Merge, split, convert, and manage PDF files.',
      buttonText: 'Open PDF Tools →',
      icon: FileCode2,
      iconBg: '#ECFDF5',
      iconBorder: '#D1FAE5',
      iconColor: '#059669',
      btnBg: '#ECFDF5',
      btnColor: '#047857',
      hoverBorder: '#34D399'
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      desc: 'Analyze your academic performance and track your results.',
      buttonText: 'Check Result →',
      icon: BarChart2,
      iconBg: '#FFF7ED',
      iconBorder: '#FFEDD5',
      iconColor: '#EA580C',
      btnBg: '#FFF7ED',
      btnColor: '#C2410C',
      hoverBorder: '#FB923C'
    },
    {
      id: 'scholarships',
      title: 'Scholarships & Grants',
      desc: 'Explore government and private scholarship opportunities.',
      buttonText: 'Explore Scholarships →',
      icon: Award,
      iconBg: '#FAF5FF',
      iconBorder: '#F3E8FF',
      iconColor: '#7C3AED',
      btnBg: '#FAF5FF',
      btnColor: '#6D28D9',
      hoverBorder: '#A855F7'
    }
  ];

  return (
    <section style={{
      backgroundColor: '#FAF5ED',
      padding: '1rem 0 3.5rem 0',
      position: 'relative'
    }}>
      <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        
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
              color: '#1C1917',
              margin: '0 0 0.35rem 0',
              lineHeight: 1.2
            }}>
              Explore Our <span style={{ color: '#D97706' }}>Tools</span>
            </h2>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.92rem',
              color: '#78716C',
              margin: 0,
              fontWeight: 600
            }}>
              Everything you need for your academic and career preparation in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('more')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: '1.5px solid #E5DFD3',
              backgroundColor: '#FFFFFF',
              color: '#1C1917',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 6px rgba(35,30,25,0.03)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C88D2D';
              e.currentTarget.style.backgroundColor = '#FAF7F2';
              e.currentTarget.style.color = '#781416';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5DFD3';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#1C1917';
            }}
          >
            <span>View All Tools</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 8 Tools Grid (4 columns desktop, 2 tablet, 1 mobile) */}
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
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #EBE4D5',
                  borderRadius: '18px',
                  padding: '1.4rem 1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = tool.hoverBorder;
                  e.currentTarget.style.boxShadow = '0 14px 32px rgba(35, 30, 25, 0.09)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#EBE4D5';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 30, 25, 0.04)';
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
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
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
                      color: '#1C1917',
                      margin: 0,
                      lineHeight: 1.2
                    }}>
                      {tool.title}
                    </h3>
                    {tool.isBeta && (
                      <span style={{
                        backgroundColor: '#D97706',
                        color: '#FFFFFF',
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        padding: '0.08rem 0.38rem',
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
                    color: '#64748B',
                    lineHeight: 1.5,
                    margin: '0 0 1.25rem 0',
                    fontWeight: 500
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
                      border: 'none',
                      backgroundColor: tool.btnBg,
                      color: tool.btnColor,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.filter = 'brightness(0.95)';
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.filter = 'none';
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
