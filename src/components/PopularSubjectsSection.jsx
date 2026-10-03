import React from 'react';
import { 
  Calculator, 
  Code2, 
  Layers, 
  Terminal, 
  ArrowRight 
} from 'lucide-react';

export default function PopularSubjectsSection({ onOpenSubject, onNavigate }) {
  const subjects = [
    {
      id: 'eng-maths',
      name: 'Engineering Mathematics',
      desc: 'Calculus, Linear Algebra & Differential Equations',
      badge: 'AKTU B.Tech • 1st & 2nd Year',
      icon: Calculator,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      border: '#BFDBFE',
      arrowBg: '#DBEAFE',
      arrowColor: '#2563EB',
      subjectData: {
        name: 'Engineering Mathematics',
        course: 'B.Tech',
        branch: 'CSE',
        year: '1st Year'
      }
    },
    {
      id: 'pps',
      name: 'Programming for Problem Solving',
      desc: 'C Language, Algorithms, Pointers & Recursion',
      badge: 'C Programming • 1st Year',
      icon: Code2,
      iconColor: '#DC2626',
      iconBg: '#FEF2F2',
      border: '#FECACA',
      arrowBg: '#FEE2E2',
      arrowColor: '#DC2626',
      subjectData: {
        name: 'Programming for Problem Solving',
        course: 'B.Tech',
        branch: 'CSE',
        year: '1st Year'
      }
    },
    {
      id: 'ds',
      name: 'Data Structures',
      desc: 'Linked Lists, Stacks, Queues, Trees & Graphs',
      badge: 'KCS-301 • 2nd Year • Sem 3',
      icon: Layers,
      iconColor: '#D97706',
      iconBg: '#FFFBEB',
      border: '#FDE68A',
      arrowBg: '#FEF3C7',
      arrowColor: '#D97706',
      subjectData: {
        name: 'Data Structures',
        code: 'KCS-301',
        course: 'B.Tech',
        branch: 'CSE',
        year: '2nd Year',
        sem: 'Sem 3'
      }
    },
    {
      id: 'os',
      name: 'Operating Systems',
      desc: 'Processes, CPU Scheduling, Memory & File Systems',
      badge: 'KCS-401 • 2nd Year • Sem 4',
      icon: Terminal,
      iconColor: '#0284C7',
      iconBg: '#F0F9FF',
      border: '#BAE6FD',
      arrowBg: '#E0F2FE',
      arrowColor: '#0284C7',
      subjectData: {
        name: 'Operating System',
        code: 'KCS-401',
        course: 'B.Tech',
        branch: 'CSE',
        year: '2nd Year',
        sem: 'Sem 4'
      }
    }
  ];

  const handleSubjectClick = (sub) => {
    if (onOpenSubject) {
      onOpenSubject(sub.subjectData);
    } else if (onNavigate) {
      onNavigate('notes');
    }
  };

  return (
    <section 
      style={{
        backgroundColor: '#FAF7F2',
        padding: '3rem 0 3.5rem 0',
        borderBottom: '1.5px solid #E8E2D5'
      }}
    >
      <div className="container">
        {/* Header with Title and "View All Subjects" button */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
              fontWeight: 800,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em',
              margin: '0 0 0.4rem 0'
            }}>
              <span role="img" aria-label="book">📖</span>
              <h2>Popular Subjects</h2>
            </div>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748B',
              fontWeight: 500,
              margin: 0
            }}>
              Explore notes, PYQs and quizzes of the most popular subjects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('notes') : null}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '9999px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E2D9C8',
              color: '#1C1E21',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(35,30,25,0.04)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#781416';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#781416';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#1C1E21';
              e.currentTarget.style.borderColor = '#E2D9C8';
            }}
          >
            <span>View All Subjects</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 4 Popular Subject Cards */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          style={{ alignItems: 'stretch' }}
        >
          {subjects.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSubjectClick(s)}
                aria-label={s.name}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${s.border}`,
                  borderRadius: '20px',
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 14px rgba(35,30,25,0.04)',
                  position: 'relative',
                  outline: 'none',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(35,30,25,0.08)';
                  e.currentTarget.style.borderColor = s.iconColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(35,30,25,0.04)';
                  e.currentTarget.style.borderColor = s.border;
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: s.iconBg,
                  color: s.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  border: `1px solid ${s.border}`
                }}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>

                {/* Subject Name */}
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#1C1E21',
                  margin: '0 0 0.35rem 0',
                  lineHeight: 1.3
                }}>
                  {s.name}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.8rem',
                  color: '#64748B',
                  lineHeight: 1.45,
                  margin: '0 0 0.85rem 0',
                  flexGrow: 1
                }}>
                  {s.desc}
                </p>

                {/* Badge */}
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: s.iconColor,
                  backgroundColor: s.iconBg,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  border: `1px solid ${s.border}`,
                  marginBottom: '1.15rem'
                }}>
                  {s.badge}
                </div>

                {/* Bottom Arrow */}
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: s.arrowBg,
                  color: s.arrowColor,
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
