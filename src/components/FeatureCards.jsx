import React from 'react';
import { 
  FileText, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  Bot, 
  Users, 
  Calendar, 
  TrendingUp,
  Briefcase,
  Award
} from 'lucide-react';

export default function FeatureCards({ onCardClick }) {
  const cards = [
    {
      id: 'pyqs',
      title: 'PYQs',
      subtitle: 'Year-wise Papers',
      icon: FileText,
      bgColor: '#fff4ed',
      iconBg: '#ff7e4b',
      iconColor: '#ffffff',
      borderColor: '#ffd5c0'
    },
    {
      id: 'notes',
      title: 'Notes',
      subtitle: 'Unit-wise Notes',
      icon: BookOpen,
      bgColor: '#FDF6E8',
      iconBg: '#C88D2D',
      iconColor: '#ffffff',
      borderColor: '#E8D3B0'
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      subtitle: 'Official & Updated',
      icon: GraduationCap,
      bgColor: '#f3e8ff',
      iconBg: '#8b5cf6',
      iconColor: '#ffffff',
      borderColor: '#ddd6fe'
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      subtitle: 'Practice & Improve',
      icon: HelpCircle,
      bgColor: '#ffedd5',
      iconBg: '#f97316',
      iconColor: '#ffffff',
      borderColor: '#fed7aa'
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      subtitle: 'Placement Ready',
      icon: Briefcase,
      bgColor: '#fee2e2',
      iconBg: '#781416',
      iconColor: '#ffffff',
      borderColor: '#fca5a5'
    },
    {
      id: 'result-cgpa',
      title: 'Result & SGPA',
      subtitle: 'Marksheet Parser',
      icon: Award,
      bgColor: '#ecfdf5',
      iconBg: '#10b981',
      iconColor: '#ffffff',
      borderColor: '#a7f3d0'
    },
    {
      id: 'planner',
      title: 'Study Planner',
      subtitle: 'Plan Your Success',
      icon: Calendar,
      bgColor: '#fef3c7',
      iconBg: '#f59e0b',
      iconColor: '#ffffff',
      borderColor: '#fde68a'
    },
    {
      id: 'progress',
      title: 'Progress',
      subtitle: 'Track & Grow',
      icon: TrendingUp,
      bgColor: '#fce7f3',
      iconBg: '#ec4899',
      iconColor: '#ffffff',
      borderColor: '#fbcfe8'
    }
  ];

  return (
    <section style={{
      backgroundColor: '#FAF7F2',
      padding: '2rem 0',
      borderBottom: '1.5px solid #E8E2D5',
      perspective: '1200px'
    }}>
      <div className="container">
        <div 
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5"
          style={{
            alignItems: 'stretch'
          }}
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
                  backgroundColor: c.bgColor,
                  border: `1.5px solid ${c.borderColor}`,
                  borderRadius: '18px',
                  padding: '1.15rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 6px 16px rgba(35,30,25,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
                  outline: 'none',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) rotateX(4deg) translateZ(8px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px rgba(35,30,25,0.09), 0 2px 4px rgba(35,30,25,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) rotateX(0) translateZ(0)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(35,30,25,0.04)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px) scale(0.97) translateZ(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) rotateX(4deg) translateZ(8px)';
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.97)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: c.iconBg,
                  color: c.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.65rem',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
                  transform: 'translateZ(14px)',
                  transition: 'transform 0.25s ease'
                }}>
                  <Icon size={22} />
                </div>
                
                <div style={{
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  color: '#1C1E21',
                  lineHeight: 1.2
                }}>
                  {c.title}
                </div>
                
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#646E78',
                  marginTop: '0.2rem'
                }}>
                  {c.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
