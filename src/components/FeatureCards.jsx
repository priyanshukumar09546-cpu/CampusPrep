import React from 'react';
import { 
  FileText, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  Bot, 
  Users, 
  Calendar, 
  TrendingUp 
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
      bgColor: '#eafaf1',
      iconBg: '#10b981',
      iconColor: '#ffffff',
      borderColor: '#bbf7d0'
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
      id: 'aistudy',
      title: 'AI Study',
      subtitle: 'Ask. Learn. Ace.',
      icon: Bot,
      bgColor: '#e0f2fe',
      iconBg: '#0284c7',
      iconColor: '#ffffff',
      borderColor: '#bae6fd'
    },
    {
      id: 'community',
      title: 'Community',
      subtitle: 'Doubts & Discussion',
      icon: Users,
      bgColor: '#ccfbf1',
      iconBg: '#14b8a6',
      iconColor: '#ffffff',
      borderColor: '#99f6e4'
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
      backgroundColor: '#f9f7f1',
      padding: '1.75rem 0',
      borderBottom: '1px solid #eae5d9'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.9rem'
        }}>
          {cards.map(c => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => onCardClick && onCardClick(c.id)}
                style={{
                  backgroundColor: c.bgColor,
                  border: `1px solid ${c.borderColor}`,
                  borderRadius: '16px',
                  padding: '1.1rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25 ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: c.iconBg,
                  color: c.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.6rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  <Icon size={22} />
                </div>
                
                <div style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  lineHeight: 1.2
                }}>
                  {c.title}
                </div>
                
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: '#64748b',
                  marginTop: '0.2rem'
                }}>
                  {c.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
