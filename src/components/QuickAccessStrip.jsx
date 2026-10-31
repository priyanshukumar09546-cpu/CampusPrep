import React from 'react';
import {
  BookOpen,
  FileText,
  ListOrdered,
  Zap,
  FileSpreadsheet,
  Mic,
  BarChart2
} from 'lucide-react';

export default function QuickAccessStrip({ onNavigate }) {
  const items = [
    {
      id: 'notes',
      title: 'Engineering Notes',
      desc: 'Unit-wise study material',
      icon: BookOpen,
      iconBg: 'rgba(236, 72, 153, 0.12)',
      iconBorder: 'rgba(236, 72, 153, 0.3)',
      iconColor: '#F472B6'
    },
    {
      id: 'pyqs',
      title: 'AKTU PYQs',
      desc: 'Previous year questions',
      icon: FileText,
      iconBg: 'rgba(255, 184, 0, 0.12)',
      iconBorder: 'rgba(255, 184, 0, 0.35)',
      iconColor: '#FFB800'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      desc: 'Branch-wise syllabus',
      icon: ListOrdered,
      iconBg: 'rgba(168, 85, 247, 0.12)',
      iconBorder: 'rgba(168, 85, 247, 0.3)',
      iconColor: '#C084FC'
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      desc: 'Topic-wise practice',
      icon: Zap,
      iconBg: 'rgba(16, 185, 129, 0.12)',
      iconBorder: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#34D399'
    },
    {
      id: 'resume-maker',
      title: 'Resume Maker',
      desc: 'Build ATS-ready resume',
      icon: FileSpreadsheet,
      iconBg: 'rgba(59, 130, 246, 0.12)',
      iconBorder: 'rgba(59, 130, 246, 0.3)',
      iconColor: '#60A5FA'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      desc: 'AI mock interviews',
      icon: Mic,
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconBorder: 'rgba(239, 68, 68, 0.3)',
      iconColor: '#F87171'
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      desc: 'Analyze your performance',
      icon: BarChart2,
      iconBg: 'rgba(255, 140, 0, 0.12)',
      iconBorder: 'rgba(255, 140, 0, 0.35)',
      iconColor: '#FF8C00'
    }
  ];

  return (
    <section className="pv-scroll-reveal" style={{
      backgroundColor: 'transparent',
      padding: '0 0 2.25rem 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          backgroundColor: '#0B0B0B',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.04)',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          alignItems: 'stretch',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box'
        }} className="quick-access-grid">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === items.length - 1;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate && onNavigate(item.id)}
                className="quick-access-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.85rem 0.55rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRight: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  outline: 'none',
                  position: 'relative',
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#141414';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon Container */}
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: item.iconBg,
                  border: `1px solid ${item.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: item.iconColor,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}>
                  <Icon size={17} strokeWidth={2.2} />
                </div>

                {/* Text Labels */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    color: '#A1A1AA',
                    marginTop: '0.14rem',
                    lineHeight: 1.22,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .quick-access-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .quick-access-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
