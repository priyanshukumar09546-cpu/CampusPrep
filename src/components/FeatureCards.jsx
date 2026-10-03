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
      bgColor: '#FEF2F2',
      iconBg: '#EF4444',
      iconColor: '#FFFFFF',
      borderColor: '#FECACA',
      arrowBg: '#FEE2E2',
      arrowColor: '#DC2626'
    },
    {
      id: 'notes',
      title: 'Notes',
      subtitle: 'Unit-wise Study Materials',
      icon: BookOpen,
      bgColor: '#FFFBEB',
      iconBg: '#F59E0B',
      iconColor: '#FFFFFF',
      borderColor: '#FDE68A',
      arrowBg: '#FEF3C7',
      arrowColor: '#D97706'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      subtitle: 'Official & Updated Syllabus',
      icon: GraduationCap,
      bgColor: '#F5F3FF',
      iconBg: '#8B5CF6',
      iconColor: '#FFFFFF',
      borderColor: '#DDD6FE',
      arrowBg: '#EDE9FE',
      arrowColor: '#7C3AED'
    },
    {
      id: 'internships-jobs',
      title: 'Internships & Jobs',
      subtitle: 'Latest Opportunities',
      icon: Briefcase,
      bgColor: '#F0F9FF',
      iconBg: '#0284C7',
      iconColor: '#FFFFFF',
      borderColor: '#BAE6FD',
      arrowBg: '#E0F2FE',
      arrowColor: '#0369A1'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      subtitle: 'Placement Preparation & Mock',
      icon: Code2,
      bgColor: '#FFF1F2',
      iconBg: '#BE123C',
      iconColor: '#FFFFFF',
      borderColor: '#FECDD3',
      arrowBg: '#FFE4E6',
      arrowColor: '#9F1239'
    },
    {
      id: 'pdf-maker',
      title: 'PDF Maker & Splitter',
      subtitle: 'Merge, Split & Convert',
      icon: FileStack,
      bgColor: '#ECFDF5',
      iconBg: '#10B981',
      iconColor: '#FFFFFF',
      borderColor: '#A7F3D0',
      arrowBg: '#D1FAE5',
      arrowColor: '#059669'
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      subtitle: 'Marksheet Parser & Tools',
      icon: Calculator,
      bgColor: '#EEF2FF',
      iconBg: '#6366F1',
      iconColor: '#FFFFFF',
      borderColor: '#C7D2FE',
      arrowBg: '#E0E7FF',
      arrowColor: '#4F46E5'
    },
    {
      id: 'scholarships',
      title: 'Scholarships & Grants',
      subtitle: 'Government & Private',
      icon: Award,
      bgColor: '#FFF7ED',
      iconBg: '#EA580C',
      iconColor: '#FFFFFF',
      borderColor: '#FFEDD5',
      arrowBg: '#FFEDD5',
      arrowColor: '#C2410C'
    }
  ];

  return (
    <section 
      style={{
        backgroundColor: '#FAF7F2',
        padding: '2.25rem 0 1.75rem 0',
        borderBottom: '1.5px solid #E8E2D5'
      }}
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
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${c.borderColor}`,
                  borderRadius: '20px',
                  padding: '1.25rem 0.85rem 1rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 4px 14px rgba(35,30,25,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                  outline: 'none',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(35,30,25,0.08)';
                  e.currentTarget.style.borderColor = c.iconBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(35,30,25,0.04)';
                  e.currentTarget.style.borderColor = c.borderColor;
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
                  color: '#1C1E21',
                  lineHeight: 1.25,
                  marginBottom: '0.25rem'
                }}>
                  {c.title}
                </div>
                
                {/* Subtitle */}
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: '#64748B',
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
