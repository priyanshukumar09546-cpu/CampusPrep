import React from 'react';
import { 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  FileStack, 
  Calculator, 
  Award,
  ArrowRight
} from 'lucide-react';

export default function FeatureCards({ onCardClick }) {
  const cards = [
    {
      id: 'pyqs',
      title: 'PYQs',
      subtitle: 'Year-wise Question Papers',
      icon: FileText,
      bgColor: 'rgba(239, 68, 68, 0.12)',
      iconBg: '#EF4444',
      iconColor: '#FFFFFF',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      arrowBg: 'rgba(255, 184, 0, 0.1)',
      arrowColor: '#FFB800'
    },
    {
      id: 'notes',
      title: 'Notes',
      subtitle: 'Unit-wise Study Materials',
      icon: BookOpen,
      bgColor: 'rgba(245, 158, 11, 0.12)',
      iconBg: '#F59E0B',
      iconColor: '#FFFFFF',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      arrowBg: 'rgba(255, 184, 0, 0.1)',
      arrowColor: '#FFB800'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      subtitle: 'Official & Updated Syllabus',
      icon: GraduationCap,
      bgColor: 'rgba(139, 92, 246, 0.12)',
      iconBg: '#8B5CF6',
      iconColor: '#FFFFFF',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      arrowBg: 'rgba(255, 184, 0, 0.1)',
      arrowColor: '#FFB800'
    },
    {
      id: 'internships-jobs',
      title: 'Internships & Jobs',
      subtitle: 'Latest Opportunities',
      icon: Briefcase,
      bgColor: 'rgba(2, 132, 199, 0.12)',
      iconBg: '#0284C7',
      iconColor: '#FFFFFF',
      borderColor: 'rgba(2, 132, 199, 0.3)',
      arrowBg: 'rgba(255, 184, 0, 0.1)',
      arrowColor: '#FFB800'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      subtitle: 'Placement Preparation & Mock',
      icon: Code2,
      bgColor: 'rgba(255, 184, 0, 0.12)',
      iconBg: '#FFB800',
      iconColor: '#FFFFFF',
      borderColor: 'rgba(255, 184, 0, 0.35)',
      arrowBg: 'rgba(255, 184, 0, 0.1)',
      arrowColor: '#FFB800'
    },
    {
      id: 'pdf-maker',
      title: 'PDF Maker & Splitter',
      subtitle: 'Merge, Split & Convert',
      icon: FileStack,
      bgColor: 'rgba(16, 185, 129, 0.12)',
      iconBg: '#10B981',
      iconColor: '#FFFFFF',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      arrowBg: 'rgba(255, 184, 0, 0.1)',
      arrowColor: '#FFB800'
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      subtitle: 'Marksheet Parser & Tools',
      icon: Calculator,
      bgColor: 'rgba(99, 102, 241, 0.12)',
      iconBg: '#6366F1',
      iconColor: '#FFFFFF',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      arrowBg: 'rgba(255, 184, 0, 0.1)',
      arrowColor: '#FFB800'
    },
    {
      id: 'scholarships',
      title: 'Scholarships & Grants',
      subtitle: 'Government & Private',
      icon: Award,
      bgColor: 'rgba(234, 88, 12, 0.12)',
      iconBg: '#EA580C',
      iconColor: '#FFFFFF',
      borderColor: 'rgba(234, 88, 12, 0.3)',
      arrowBg: 'rgba(255, 184, 0, 0.1)',
      arrowColor: '#FFB800'
    }
  ];

  return (
    <section 
      style={{
        backgroundColor: 'transparent',
        padding: '2.25rem 0 1.75rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      className="pv-scroll-reveal"
    >
      <div className="container">
        <div 
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5"
          style={{ alignItems: 'stretch' }}
        >
          {cards.map(c => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onCardClick && onCardClick(c.id)}
                aria-label={`${c.title} - ${c.subtitle}`}
                style={{
                  backgroundColor: '#0B0B0B',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.25rem 0.85rem 1rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  outline: 'none',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.9), 0 0 16px rgba(255, 184, 0, 0.18)';
                  e.currentTarget.style.borderColor = '#FFB800';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {/* Top Icon Badge */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: c.bgColor,
                  color: c.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem',
                  border: `1px solid ${c.borderColor}`
                }}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                
                {/* Title */}
                <div style={{
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.25,
                  marginBottom: '0.25rem'
                }}>
                  {c.title}
                </div>
                
                {/* Subtitle */}
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: '#A1A1AA',
                  lineHeight: 1.3,
                  marginBottom: '1rem',
                  flexGrow: 1
                }}>
                  {c.subtitle}
                </div>

                {/* Bottom Right Arrow */}
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: c.arrowBg,
                  color: c.arrowColor,
                  border: '1px solid rgba(255, 184, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  marginTop: 'auto'
                }}>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
