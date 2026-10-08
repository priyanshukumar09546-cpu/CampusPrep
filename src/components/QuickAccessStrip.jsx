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
      iconBg: '#FDF2F8',
      iconBorder: '#FBCFE8',
      iconColor: '#DB2777'
    },
    {
      id: 'pyqs',
      title: 'AKTU PYQs',
      desc: 'Previous year questions',
      icon: FileText,
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A',
      iconColor: '#D97706'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      desc: 'Branch-wise syllabus',
      icon: ListOrdered,
      iconBg: '#F3E8FF',
      iconBorder: '#E9D5FF',
      iconColor: '#9333EA'
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      desc: 'Topic-wise practice',
      icon: Zap,
      iconBg: '#DCFCE7',
      iconBorder: '#BBF7D0',
      iconColor: '#16A34A'
    },
    {
      id: 'resume-maker',
      title: 'Resume Maker',
      desc: 'Build ATS-ready resume',
      icon: FileSpreadsheet,
      iconBg: '#DBEAFE',
      iconBorder: '#BFDBFE',
      iconColor: '#2563EB'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      desc: 'AI mock interviews',
      icon: Mic,
      iconBg: '#FEE2E2',
      iconBorder: '#FECACA',
      iconColor: '#DC2626'
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      desc: 'Analyze your performance',
      icon: BarChart2,
      iconBg: '#FFEDD5',
      iconBorder: '#FED7AA',
      iconColor: '#EA580C'
    }
  ];

  return (
    <section style={{
      backgroundColor: '#FAF5ED',
      padding: '0 0 2.25rem 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #EBE4D5',
          boxShadow: '0 8px 30px rgba(35, 30, 25, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          alignItems: 'stretch',
          overflow: 'hidden'
        }} className="quick-access-grid">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === items.length - 1;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate && onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '1.1rem 0.85rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRight: isLast ? 'none' : '1px solid #F0E8D9',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  outline: 'none',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FCFAF6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon Container */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: item.iconBg,
                  border: `1px solid ${item.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: item.iconColor,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}>
                  <Icon size={18} strokeWidth={2.2} />
                </div>

                {/* Text Labels */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    color: '#1C1917',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#78716C',
                    marginTop: '0.18rem',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Stacking */}
      <style>{`
        @media (max-width: 1080px) {
          .quick-access-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 0.5rem;
          }
          .quick-access-grid > button {
            flex: 0 0 210px !important;
            scroll-snap-align: start;
            border-right: 1px solid #F0E8D9 !important;
          }
        }
      `}</style>
    </section>
  );
}
