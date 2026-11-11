import React from 'react';
import {
  BookOpen,
  FileText,
  ListOrdered,
  Zap,
  FileSpreadsheet,
  Mic,
  BarChart2,
  ArrowRight
} from 'lucide-react';

export default function QuickAccessStrip({ onNavigate }) {
  const items = [
    {
      id: 'notes',
      title: 'Engineering Notes',
      desc: 'Unit-wise study material',
      icon: BookOpen,
      iconBg: '#FDF2F8',
      iconBorder: '#FBCFE8',
      iconColor: '#DB2777'
    },
    {
      id: 'pyqs',
      title: 'AKTU PYQs',
      desc: 'Previous year questions',
      icon: FileText,
      iconBg: '#FFFBEB',
      iconBorder: '#FDE68A',
      iconColor: '#D97706'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      desc: 'Branch-wise syllabus',
      icon: ListOrdered,
      iconBg: '#F5F3FF',
      iconBorder: '#DDD6FE',
      iconColor: '#7C3AED'
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      desc: 'Topic-wise practice',
      icon: Zap,
      iconBg: '#F0FDF4',
      iconBorder: '#BBF7D0',
      iconColor: '#16A34A'
    },
    {
      id: 'resume-maker',
      title: 'Resume Maker',
      desc: 'Build ATS-ready resume',
      icon: FileSpreadsheet,
      iconBg: '#EFF6FF',
      iconBorder: '#BFDBFE',
      iconColor: '#2563EB'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      desc: 'AI mock interviews',
      icon: Mic,
      iconBg: '#FFF1F2',
      iconBorder: '#FECDD3',
      iconColor: '#E11D48'
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      desc: 'Analyze your performance',
      icon: BarChart2,
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A',
      iconColor: '#B45309'
    }
  ];

  return (
    <section
      style={{
        backgroundColor: '#FFFFFF',
        padding: '0 0 3rem 0',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            alignItems: 'stretch',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}
          className="pv-quick-access-grid pv-reveal-group"
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === items.length - 1;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`pv-reveal-card pv-stagger-${idx + 1}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '1rem 0.85rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRight: isLast ? 'none' : '1px solid #F1F5F9',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Icon Container */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: item.iconBg,
                    border: `1px solid ${item.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: item.iconColor
                  }}
                >
                  <Icon size={18} strokeWidth={2.4} />
                </div>

                {/* Text Labels */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: '#64748B',
                      marginTop: '0.15rem',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <span>{item.desc}</span>
                    <span style={{ color: '#94A3B8' }}>&rarr;</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .pv-quick-access-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .pv-quick-access-grid > button {
            border-bottom: 1px solid #F1F5F9;
          }
        }
        @media (max-width: 640px) {
          .pv-quick-access-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
