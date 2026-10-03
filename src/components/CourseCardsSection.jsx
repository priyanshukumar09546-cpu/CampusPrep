import React from 'react';
import { 
  GraduationCap, 
  Laptop, 
  BarChart3, 
  Pill, 
  Briefcase, 
  Monitor, 
  Cpu, 
  LayoutGrid, 
  ArrowRight 
} from 'lucide-react';

export default function CourseCardsSection({ onSelectCourse, onNavigate }) {
  const courses = [
    {
      id: 'btech',
      title: 'B.Tech',
      subtitle: 'Engineering',
      icon: GraduationCap,
      bgColor: '#FEF2F2',
      iconBg: '#DC2626',
      borderColor: '#FECACA',
      arrowBg: '#FEE2E2',
      arrowColor: '#DC2626'
    },
    {
      id: 'bca',
      title: 'BCA',
      subtitle: 'Computer Applications',
      icon: Laptop,
      bgColor: '#EFF6FF',
      iconBg: '#2563EB',
      borderColor: '#BFDBFE',
      arrowBg: '#DBEAFE',
      arrowColor: '#2563EB'
    },
    {
      id: 'bba',
      title: 'BBA',
      subtitle: 'Business Administration',
      icon: BarChart3,
      bgColor: '#F5F3FF',
      iconBg: '#7C3AED',
      borderColor: '#DDD6FE',
      arrowBg: '#EDE9FE',
      arrowColor: '#7C3AED'
    },
    {
      id: 'bpharm',
      title: 'BPharm',
      subtitle: 'Pharmacy',
      icon: Pill,
      bgColor: '#ECFDF5',
      iconBg: '#059669',
      borderColor: '#A7F3D0',
      arrowBg: '#D1FAE5',
      arrowColor: '#059669'
    },
    {
      id: 'mba',
      title: 'MBA',
      subtitle: 'Management',
      icon: Briefcase,
      bgColor: '#FFF1F2',
      iconBg: '#E11D48',
      borderColor: '#FECDD3',
      arrowBg: '#FFE4E6',
      arrowColor: '#E11D48'
    },
    {
      id: 'mca',
      title: 'MCA',
      subtitle: 'Computer Applications',
      icon: Monitor,
      bgColor: '#F0F9FF',
      iconBg: '#0284C7',
      borderColor: '#BAE6FD',
      arrowBg: '#E0F2FE',
      arrowColor: '#0284C7'
    },
    {
      id: 'mtech',
      title: 'MTech',
      subtitle: 'Advanced Engineering',
      icon: Cpu,
      bgColor: '#EEF2FF',
      iconBg: '#4F46E5',
      borderColor: '#C7D2FE',
      arrowBg: '#E0E7FF',
      arrowColor: '#4F46E5'
    },
    {
      id: 'more-courses',
      title: 'More Courses',
      subtitle: 'Explore All',
      icon: LayoutGrid,
      bgColor: '#FFFBEB',
      iconBg: '#D97706',
      borderColor: '#FDE68A',
      arrowBg: '#FEF3C7',
      arrowColor: '#D97706'
    }
  ];

  const handleCardClick = (courseId) => {
    if (courseId === 'more-courses') {
      if (onNavigate) {
        onNavigate('select-course');
      } else if (onSelectCourse) {
        onSelectCourse('btech');
      }
    } else {
      if (onSelectCourse) {
        onSelectCourse(courseId);
      }
    }
  };

  return (
    <section 
      style={{
        backgroundColor: '#FAF7F2',
        padding: '3rem 0 2.5rem 0',
        borderBottom: '1.5px solid #E8E2D5'
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
            fontWeight: 800,
            color: '#1C1E21',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em',
            margin: '0 0 0.45rem 0'
          }}>
            Choose Your Course
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: '#64748B',
            fontWeight: 500,
            margin: 0
          }}>
            Different courses, same goal — <span style={{ color: '#C88D2D', fontWeight: 600 }}>A brighter future !</span>
          </p>
        </div>

        {/* 8 Course Cards Grid */}
        <div 
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5"
          style={{ alignItems: 'stretch' }}
        >
          {courses.map(c => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCardClick(c.id)}
                aria-label={`${c.title} - ${c.subtitle}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${c.borderColor}`,
                  borderRadius: '20px',
                  padding: '1.35rem 0.85rem 1.15rem 0.85rem',
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
                {/* Icon Badge */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: c.bgColor,
                  color: c.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  border: `1px solid ${c.borderColor}`
                }}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>

                {/* Course Title */}
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#1C1E21',
                  lineHeight: 1.25,
                  marginBottom: '0.25rem'
                }}>
                  {c.title}
                </div>

                {/* Course Subtitle */}
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: 1.3,
                  marginBottom: '1.25rem',
                  flexGrow: 1
                }}>
                  {c.subtitle}
                </div>

                {/* Bottom Arrow Indicator */}
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
